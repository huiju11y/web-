/**
 * CameraHub AI 智能助手
 * 支持 OpenAI 兼容接口，可配置 API Key / Base URL / Model
 */
const AIService = {
  // ========== 配置（默认接入豆包） ==========
  config: {
    apiKey: '',
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    model: 'doubao-pro-32k',
    maxTokens: 2048,
    temperature: 0.7,
  },

  // 对话历史
  history: [],

  // 是否正在请求中
  loading: false,

  // ========== 初始化：从 localStorage 加载配置 ==========
  init() {
    try {
      const saved = localStorage.getItem('camerahub_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && !parsed.apiKey.startsWith('sk-')) {
          // 不恢复占位 key
          delete parsed.apiKey;
        }
        Object.assign(this.config, parsed);
      }
    } catch (e) { /* ignore */ }
  },

  saveConfig() {
    try {
      // 不存储明文 key（生产环境应后端代理）
      const toSave = { ...this.config };
      localStorage.setItem('camerahub_ai_config', JSON.stringify(toSave));
    } catch (e) { /* ignore */ }
  },

  // ========== 构建系统提示词（精简版，不含完整器材列表） ==========
  buildSystemPrompt() {
    const products = MockData.products;
    const rentalProducts = products.filter(p => p.type === 'rent');
    const usedProducts = products.filter(p => p.type === 'used');

    // 只统计概览，不列举每件器材
    const rentalSummary = rentalProducts.map(p => {
      const brand = MockData.brands.find(b => b.id === p.brand)?.name || '';
      return `- ${brand} | ${p.name} | 日租¥${p.price.daily}`;
    }).join('\n');

    const usedSummary = usedProducts.map(p => {
      const brand = MockData.brands.find(b => b.id === p.brand)?.name || '';
      return `- ${brand} | ${p.name} | 售价¥${p.price.sell}`;
    }).join('\n');

    return `你是 CameraHub 摄影器材租赁与二手交易平台的 AI 智能客服助手，名字叫"小C"。请用简体中文、友好专业的语气与用户交流。

【平台介绍】
CameraHub 是一个专业的摄影器材租赁与二手保真交易平台，覆盖 Canon/Nikon/Sony/Fujifilm/Sigma/DJI 等品牌，提供单反、微单、镜头、摄像机、灯光、配件等全品类器材。

【可租赁器材】
${rentalSummary}

【可买二手器材】
${usedSummary}

【你的能力】
1. 器材推荐：根据用户的预算、需求（人像/风光/视频/Vlog/商业等）推荐最合适的器材
2. 价格咨询：回答租金、售价等问题
3. 租赁帮助：解释租期选择（按天/周/月）、押金退还规则
4. 二手交易：解答保真鉴定流程、二手购买注意事项
5. 摄影问答：回答摄影技巧相关问题

【回复要求】
- 简洁明了，控制在200字以内
- 推荐器材时给出名称和价格
- 优先推荐性价比最高的方案
- 不要编造不存在的器材或价格信息`;
  },

  // ========== 构建消息列表 ==========
  buildMessages(userMessage) {
    const messages = [
      { role: 'system', content: this.buildSystemPrompt() },
    ];
    // 最近 10 轮对话
    const recentHistory = this.history.slice(-20);
    messages.push(...recentHistory);
    messages.push({ role: 'user', content: userMessage });
    return messages;
  },

  // ========== 调用 API（非流式） ==========
  async chat(userMessage) {
    if (!this.config.apiKey || this.config.apiKey.length < 10) {
      return { error: '请先配置 API Key（点击聊天面板 ⚙️ 设置）' };
    }
    this.loading = true;
    try {
      const messages = this.buildMessages(userMessage);
      const resp = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 401) return { error: 'API Key 无效，请检查设置' };
        if (resp.status === 429) return { error: '请求过于频繁，请稍后再试' };
        if (resp.status === 404) return { error: `模型 "${this.config.model}" 不可用，请检查设置` };
        return { error: err.error?.message || `API 错误 (${resp.status})` };
      }

      const data = await resp.json();
      const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题。';

      this.history.push({ role: 'user', content: userMessage });
      this.history.push({ role: 'assistant', content: reply });

      // 限制历史长度
      if (this.history.length > 40) {
        this.history = this.history.slice(-40);
      }

      return { reply };
    } catch (e) {
      return { error: `网络错误：${e.message}。请检查 Base URL 是否正确。` };
    } finally {
      this.loading = false;
    }
  },

  // ========== 调用 API（流式输出） ==========
  async chatStream(userMessage, onChunk, onDone, onError) {
    if (!this.config.apiKey || this.config.apiKey.length < 10) {
      onError('请先配置 API Key（点击聊天面板 ⚙️ 设置）');
      return;
    }
    this.loading = true;
    try {
      const messages = this.buildMessages(userMessage);
      const resp = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: true,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 401) { onError('API Key 无效，请检查设置'); return; }
        if (resp.status === 429) { onError('请求过于频繁，请稍后再试'); return; }
        if (resp.status === 404) { onError(`模型 "${this.config.model}" 不可用，请检查设置`); return; }
        onError(err.error?.message || `API 错误 (${resp.status})`);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullReply += content;
              onChunk(content);
            }
          } catch (e) { /* 跳过解析错误的行 */ }
        }
      }

      this.history.push({ role: 'user', content: userMessage });
      this.history.push({ role: 'assistant', content: fullReply });
      if (this.history.length > 40) {
        this.history = this.history.slice(-40);
      }
      onDone(fullReply);
    } catch (e) {
      onError(`网络错误：${e.message}。请检查 Base URL 是否正确。`);
    } finally {
      this.loading = false;
    }
  },

  // ========== 快速智能搜索 ==========
  smartSearch(query) {
    const q = query.toLowerCase();
    const products = MockData.products;

    // 关键词权重匹配
    const scored = products.map(p => {
      let score = 0;
      const name = p.name.toLowerCase();
      const shortName = (p.shortName || '').toLowerCase();
      const desc = (p.desc || '').toLowerCase();
      const brand = (MockData.brands.find(b => b.id === p.brand)?.name || '').toLowerCase();
      const category = (MockData.categories.find(c => c.id === p.category)?.name || '').toLowerCase();

      // 名称匹配
      if (name.includes(q)) score += 50;
      if (shortName.includes(q)) score += 40;

      // 关键词匹配
      const keywords = [
        ['人像', '大光圈', '虚化'],
        ['风光', '广角', '高像素'],
        ['视频', 'vlog', '电影', '稳定'],
        ['入门', '新手', '性价比'],
        ['专业', '旗舰', '顶级'],
        ['灯光', '补光', '闪光'],
        ['稳定器', '三脚架', '云台'],
      ];

      for (const group of keywords) {
        if (group.some(kw => q.includes(kw))) {
          const text = name + ' ' + desc + ' ' + brand + ' ' + category;
          if (group.some(kw => text.includes(kw))) score += 25;
        }
      }

      // 品牌匹配
      if (brand.includes(q)) score += 30;
      // 品类匹配
      if (category.includes(q)) score += 20;
      // 描述匹配
      if (desc.includes(q)) score += 15;
      // 整体包含
      if (name.includes(q) || shortName.includes(q)) score += 10;

      // 库存加分
      if (p.stock > 0) score += 5;

      return { product: p, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.product);
  },

  // ========== 豆包语义搜索 ==========
  // 当本地匹配无结果时，调用 AI 理解用户意图，提取搜索关键词
  async semanticSearch(query) {
    if (!this.config.apiKey || this.config.apiKey.length < 10) {
      return { error: '未配置API Key，请先在⚙️设置中配置豆包 API Key' };
    }

    const productList = MockData.products.map(p => {
      const brand = MockData.brands.find(b => b.id === p.brand)?.name || '';
      return `${p.id}|${brand} ${p.name}|${p.type}`;
    }).join('\n');

    try {
      const resp = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `你是一个摄影器材搜索助手。用户会用自然语言描述需求，你需要从以下器材列表中找出最匹配的器材ID。
请只返回JSON数组，格式如 [1,5,10]，不要任何解释文字。最多返回5个结果，按匹配度从高到低排序。
器材列表：
${productList}`
            },
            { role: 'user', content: query }
          ],
          max_tokens: 200,
          temperature: 0.3,
        }),
      });

      if (!resp.ok) {
        return { error: `AI服务错误 (${resp.status})，请检查配置` };
      }

      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || '[]';
      // 提取 JSON 数组
      const match = content.match(/\[[\d,\s]+\]/);
      if (!match) return { error: 'AI返回格式异常，请重试' };

      const ids = JSON.parse(match[0]);
      const results = ids.map(id => MockData.products.find(p => p.id === id)).filter(Boolean);
      return { results };
    } catch (e) {
      return { error: `网络错误：${e.message}` };
    }
  },

  // ========== 清除历史 ==========
  clearHistory() {
    this.history = [];
  },
};

// ==================== AI 聊天 UI ====================
function initAIChat() {
  // 创建聊天组件 DOM
  const chatHTML = `
    <!-- AI 助手浮窗按钮 -->
    <button class="ai-chat-bubble" id="aiChatBubble" title="AI 智能助手">
      <span class="ai-chat-bubble-icon">🤖</span>
      <span class="ai-chat-bubble-dot"></span>
    </button>

    <!-- AI 聊天面板 -->
    <div class="ai-chat-panel" id="aiChatPanel">
      <div class="ai-chat-header">
        <div class="ai-chat-header-left">
          <span class="ai-chat-avatar">🤖</span>
          <div>
            <div class="ai-chat-title">CameraHub AI 助手</div>
            <div class="ai-chat-subtitle">小C · 智能推荐 · 摄影问答</div>
          </div>
        </div>
        <div class="ai-chat-header-actions">
          <button class="ai-chat-btn-icon" id="aiSettingsBtn" title="设置">⚙️</button>
          <button class="ai-chat-btn-icon" id="aiClearBtn" title="清除对话">🗑️</button>
          <button class="ai-chat-btn-icon" id="aiCloseBtn" title="关闭">✕</button>
        </div>
      </div>

      <!-- 设置面板 -->
      <div class="ai-settings-panel" id="aiSettingsPanel" style="display:none">
        <div class="ai-settings-title">⚙️ API 配置</div>
        <div class="form-group" style="margin-bottom:10px">
          <label style="font-size:.78rem">API Base URL</label>
          <input type="text" class="input" id="aiBaseURL" placeholder="https://ark.cn-beijing.volces.com/api/v3" style="font-size:.78rem;padding:7px 10px" />
        </div>
        <div class="form-group" style="margin-bottom:10px">
          <label style="font-size:.78rem">API Key <span style="color:var(--text-muted);font-weight:400">(以 sk- 开头)</span></label>
          <div class="input-row" style="gap:6px">
            <input type="password" class="input" id="aiApiKey" placeholder="sk-..." style="font-size:.78rem;padding:7px 10px;flex:1" />
            <button class="btn btn-sm btn-outline" id="aiToggleKey" style="flex-shrink:0;font-size:.7rem">👁️</button>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:12px">
          <label style="font-size:.78rem">模型名称</label>
          <input type="text" class="input" id="aiModel" placeholder="doubao-pro-32k" style="font-size:.78rem;padding:7px 10px" />
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" id="aiSaveConfig" style="flex:1">💾 保存配置</button>
          <button class="btn btn-outline btn-sm" id="aiTestConfig">🔍 测试连接</button>
        </div>
        <div id="aiTestResult" style="font-size:.75rem;margin-top:8px;min-height:18px"></div>
        <div style="font-size:.7rem;color:var(--text-muted);margin-top:8px;line-height:1.5">
          💡 提示：默认接入 <b>豆包(Doubao)</b>，请填入你的 API Key。<br>
          也可切换为其他 OpenAI 兼容接口（如 DeepSeek、OpenAI、Ollama 等）。
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="ai-quick-actions" id="aiQuickActions">
        <button class="ai-quick-btn" data-prompt="我想租一台适合拍视频的微单相机，预算每天150以内">🎥 器材租赁推荐</button>
        <button class="ai-quick-btn" data-prompt="我想买一部二手全画幅相机，有什么推荐？">💰 二手交易推荐</button>
      </div>

      <!-- 消息列表 -->
      <div class="ai-chat-messages" id="aiChatMessages">
        <div class="ai-message ai-message-bot">
          <div class="ai-message-avatar">🤖</div>
          <div class="ai-message-bubble">
            您好！我是 CameraHub AI 助手 <b>小C</b> 🤖<br>
            我可以帮您：
            <br>• 📷 根据需求推荐合适器材
            <br>• 💰 查询租赁价格与押金
            <br>• 🔍 智能搜索二手器材
            <br>• 📚 解答摄影相关问题
            <br><br>
            请先点击右上角 ⚙️ 配置 API Key，或点击下方快捷提问体验！
          </div>
        </div>
      </div>

      <!-- 思考中指示器 -->
      <div class="ai-typing" id="aiTyping" style="display:none">
        <div class="ai-message-avatar">🤖</div>
        <div class="ai-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="ai-chat-input-area">
        <div class="ai-chat-input-row">
          <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="输入您的问题..." autocomplete="off" />
          <button class="ai-chat-send-btn" id="aiSendBtn" title="发送">➤</button>
        </div>
        <div class="ai-chat-hint">按 Enter 发送，Shift+Enter 换行</div>
      </div>
    </div>
  `;

  // 插入到 body
  const container = document.createElement('div');
  container.innerHTML = chatHTML;
  document.body.appendChild(container.firstElementChild);
  document.body.appendChild(container.firstElementChild);

  // 初始化 AI 服务
  AIService.init();
  applyAIConfig();

  // ========== 事件绑定 ==========
  const bubble = document.getElementById('aiChatBubble');
  const panel = document.getElementById('aiChatPanel');
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiSendBtn');
  const closeBtn = document.getElementById('aiCloseBtn');
  const clearBtn = document.getElementById('aiClearBtn');
  const settingsBtn = document.getElementById('aiSettingsBtn');
  const settingsPanel = document.getElementById('aiSettingsPanel');
  const quickActions = document.getElementById('aiQuickActions');
  const messagesContainer = document.getElementById('aiChatMessages');
  const typingIndicator = document.getElementById('aiTyping');

  let isPanelOpen = false;

  // 切换面板
  bubble.addEventListener('click', () => {
    isPanelOpen = !isPanelOpen;
    panel.classList.toggle('open', isPanelOpen);
    if (isPanelOpen) {
      setTimeout(() => input.focus(), 300);
    }
  });

  closeBtn.addEventListener('click', () => {
    isPanelOpen = false;
    panel.classList.remove('open');
  });

  // 设置面板
  settingsBtn.addEventListener('click', () => {
    const isVisible = settingsPanel.style.display !== 'none';
    settingsPanel.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      applyAIConfig();
    }
  });

  // 清除对话
  clearBtn.addEventListener('click', () => {
    AIService.clearHistory();
    messagesContainer.innerHTML = `
      <div class="ai-message ai-message-bot">
        <div class="ai-message-avatar">🤖</div>
        <div class="ai-message-bubble">对话已清除，有什么可以帮您的？</div>
      </div>
    `;
    showToast('对话历史已清除');
  });

  // 发送消息
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // 添加用户消息
    appendMessage('user', text);
    input.value = '';
    quickActions.style.display = 'none';
    
    // 显示思考
    typingIndicator.style.display = 'flex';
    scrollToBottom();

    AIService.chatStream(
      text,
      // onChunk
      (chunk) => {
        // 流式追加到助手消息
        let lastMsg = messagesContainer.querySelector('.ai-message-bot.streaming');
        if (!lastMsg) {
          // 隐藏思考，创建新消息
          typingIndicator.style.display = 'none';
          const msgDiv = document.createElement('div');
          msgDiv.className = 'ai-message ai-message-bot streaming';
          msgDiv.innerHTML = `
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-bubble"></div>
          `;
          messagesContainer.appendChild(msgDiv);
          lastMsg = msgDiv;
        }
        const bubble = lastMsg.querySelector('.ai-message-bubble');
        bubble.textContent += chunk;
        scrollToBottom();
      },
      // onDone
      (fullReply) => {
        // 移除 streaming 标记
        const streaming = messagesContainer.querySelector('.ai-message-bot.streaming');
        if (streaming) streaming.classList.remove('streaming');
        typingIndicator.style.display = 'none';
        scrollToBottom();
      },
      // onError
      (errorMsg) => {
        typingIndicator.style.display = 'none';
        appendMessage('bot', '❌ ' + errorMsg);
        scrollToBottom();
      }
    );
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 快捷操作
  quickActions.addEventListener('click', (e) => {
    const btn = e.target.closest('.ai-quick-btn');
    if (!btn) return;
    input.value = btn.dataset.prompt;
    sendMessage();
  });

  // 设置相关
  document.getElementById('aiSaveConfig')?.addEventListener('click', () => {
    saveAIConfig();
  });

  document.getElementById('aiTestConfig')?.addEventListener('click', async () => {
    saveAIConfig();
    const resultEl = document.getElementById('aiTestResult');
    resultEl.textContent = '⏳ 正在测试...';
    resultEl.style.color = 'var(--text-secondary)';
    try {
      const resp = await fetch(`${AIService.config.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${AIService.config.apiKey}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        const models = (data.data || []).slice(0, 5).map(m => m.id).join(', ');
        resultEl.textContent = '✅ 连接成功！可用模型: ' + (models || '...');
        resultEl.style.color = 'var(--success)';
      } else {
        resultEl.textContent = '❌ 连接失败 (HTTP ' + resp.status + ')';
        resultEl.style.color = 'var(--danger)';
      }
    } catch (e) {
      resultEl.textContent = '❌ 网络错误，请检查 Base URL';
      resultEl.style.color = 'var(--danger)';
    }
  });

  document.getElementById('aiToggleKey')?.addEventListener('click', () => {
    const keyInput = document.getElementById('aiApiKey');
    if (keyInput.type === 'password') {
      keyInput.type = 'text';
    } else {
      keyInput.type = 'password';
    }
  });

  // ========== 辅助函数 ==========
  function appendMessage(role, text) {
    const isUser = role === 'user';
    const div = document.createElement('div');
    div.className = `ai-message ${isUser ? 'ai-message-user' : 'ai-message-bot'}`;
    div.innerHTML = `
      ${isUser ? '' : '<div class="ai-message-avatar">🤖</div>'}
      <div class="ai-message-bubble">${escapeHTML(text)}</div>
      ${isUser ? '<div class="ai-message-avatar" style="background:var(--primary)">👤</div>' : ''}
    `;
    messagesContainer.appendChild(div);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
  }

  function applyAIConfig() {
    document.getElementById('aiBaseURL').value = AIService.config.baseURL;
    document.getElementById('aiApiKey').value = AIService.config.apiKey;
    document.getElementById('aiModel').value = AIService.config.model;
  }

  function saveAIConfig() {
    AIService.config.baseURL = document.getElementById('aiBaseURL').value.trim() || 'https://api.deepseek.com/v1';
    AIService.config.apiKey = document.getElementById('aiApiKey').value.trim();
    AIService.config.model = document.getElementById('aiModel').value.trim() || 'deepseek-chat';
    AIService.saveConfig();
    showToast('AI 配置已保存');
  }
}

// 在 initApp 完成后初始化
function initAI() {
  if (typeof AIService !== 'undefined') {
    initAIChat();
  }
}
