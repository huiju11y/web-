/**
 * CameraHub 后端服务
 * - 静态文件服务
 * - 短信验证码发送 API（腾讯云 SMS）
 * 
 * 使用方法：
 *   node server.js
 * 
 * 环境变量配置（可选，不配置则使用模拟模式）：
 *   TENCENT_SECRET_ID   腾讯云 SecretId
 *   TENCENT_SECRET_KEY  腾讯云 SecretKey
 *   SMS_SDK_APP_ID      短信应用 SDK AppID
 *   SMS_SIGN_NAME       短信签名（需审核通过）
 *   SMS_TEMPLATE_ID     短信模板 ID（需审核通过）
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ========== 配置 ==========
const PORT = process.env.PORT || 3456;
const ROOT = __dirname;

// 腾讯云短信配置（从环境变量读取，不配置则使用模拟模式）
const SMS_CONFIG = {
  secretId: process.env.TENCENT_SECRET_ID || '',
  secretKey: process.env.TENCENT_SECRET_KEY || '',
  sdkAppId: process.env.SMS_SDK_APP_ID || '',
  signName: process.env.SMS_SIGN_NAME || '',
  templateId: process.env.SMS_TEMPLATE_ID || '',
};

// 验证码存储（内存，phone -> { code, expires, studentId }）
const codeStore = new Map();

// ========== MIME 类型 ==========
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// ========== 工具函数 ==========
function jsonResponse(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

// ========== 模拟短信发送 ==========
function sendSmsMock(phone, code) {
  console.log(`\n📱 ====== 模拟短信 ======`);
  console.log(`📞 手机号: ${phone}`);
  console.log(`🔑 验证码: ${code}`);
  console.log(`⏰ 有效期: 5 分钟`);
  console.log(`=========================\n`);
  return { success: true, mock: true };
}

// ========== 腾讯云短信发送（真实） ==========
async function sendSmsTencentCloud(phone, code) {
  if (!SMS_CONFIG.secretId || !SMS_CONFIG.secretKey) {
    throw new Error('未配置腾讯云密钥');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().split('T')[0];
  
  const payload = JSON.stringify({
    PhoneNumberSet: [`+86${phone}`],
    SmsSdkAppId: SMS_CONFIG.sdkAppId,
    SignName: SMS_CONFIG.signName,
    TemplateId: SMS_CONFIG.templateId,
    TemplateParamSet: [code, '5'],
  });

  const host = 'sms.tencentcloudapi.com';
  const service = 'sms';
  const action = 'SendSms';
  const version = '2021-01-11';
  const algorithm = 'TC3-HMAC-SHA256';

  // Step 1: 拼接规范请求串
  const httpRequestMethod = 'POST';
  const canonicalUri = '/';
  const canonicalQueryString = '';
  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\n`;
  const signedHeaders = 'content-type;host';
  const hashedRequestPayload = crypto.createHash('sha256').update(payload).digest('hex');
  const canonicalRequest = [
    httpRequestMethod,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    hashedRequestPayload,
  ].join('\n');

  // Step 2: 拼接待签名字符串
  const credentialScope = `${date}/${service}/tc3_request`;
  const hashedCanonicalRequest = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
  const stringToSign = [
    algorithm,
    timestamp,
    credentialScope,
    hashedCanonicalRequest,
  ].join('\n');

  // Step 3: 计算签名
  const secretDate = crypto.createHmac('sha256', `TC3${SMS_CONFIG.secretKey}`).update(date).digest();
  const secretService = crypto.createHmac('sha256', secretDate).update(service).digest();
  const secretSigning = crypto.createHmac('sha256', secretService).update('tc3_request').digest();
  const signature = crypto.createHmac('sha256', secretSigning).update(stringToSign).digest('hex');

  // Step 4: 拼接 Authorization
  const authorization = `${algorithm} Credential=${SMS_CONFIG.secretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // 发送请求
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: host,
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Host': host,
        'X-TC-Action': action,
        'X-TC-Version': version,
        'X-TC-Timestamp': timestamp,
        'X-TC-Region': 'ap-guangzhou',
        'Authorization': authorization,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.Response && result.Response.Error) {
            reject(new Error(result.Response.Error.Message));
          } else {
            resolve(result.Response);
          }
        } catch (e) {
          reject(new Error('解析响应失败'));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

// ========== 发送验证码 ==========
async function sendVerifyCode(phone) {
  // 生成6位随机验证码
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + 5 * 60 * 1000; // 5分钟有效

  // 判断使用真实短信还是模拟
  const useMock = !SMS_CONFIG.secretId || !SMS_CONFIG.secretKey
    || !SMS_CONFIG.sdkAppId || !SMS_CONFIG.signName || !SMS_CONFIG.templateId;

  if (useMock) {
    sendSmsMock(phone, code);
    console.log('💡 提示：设置环境变量 TENCENT_SECRET_ID 等可启用真实短信发送');
  } else {
    try {
      await sendSmsTencentCloud(phone, code);
      console.log(`✅ 验证码已发送至 ${phone}`);
    } catch (err) {
      console.error(`❌ 短信发送失败: ${err.message}`);
      // 失败时仍保存验证码（开发测试用，控制台可查）
      sendSmsMock(phone, code);
    }
  }

  codeStore.set(phone, { code, expires });
  return { success: true, mock: useMock };
}

// ========== 验证验证码 ==========
function verifyCode(phone, code) {
  const record = codeStore.get(phone);
  if (!record) return { valid: false, reason: '请先获取验证码' };
  if (Date.now() > record.expires) {
    codeStore.delete(phone);
    return { valid: false, reason: '验证码已过期，请重新获取' };
  }
  if (record.code !== code) {
    return { valid: false, reason: '验证码错误' };
  }
  // 验证通过后删除，防止重复使用
  codeStore.delete(phone);
  return { valid: true };
}

// ========== 静态文件服务 ==========
function serveStatic(res, urlPath) {
  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  
  // 安全检查：防止目录穿越
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback: 非静态资源都返回 index.html
        if (!ext) {
          fs.readFile(path.join(ROOT, 'index.html'), (err2, htmlData) => {
            if (err2) {
              res.writeHead(404);
              res.end('Not Found');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end(htmlData);
            }
          });
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// ========== API 路由 ==========
async function handleAPI(req, res, urlPath, method) {
  // POST /api/send-code  发送验证码
  if (urlPath === '/api/send-code' && method === 'POST') {
    const body = await parseBody(req);
    const { phone } = body;

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return jsonResponse(res, 400, { success: false, message: '请输入正确的手机号' });
    }

    // 检查60秒内是否已发送过
    const existing = codeStore.get(phone);
    if (existing && (Date.now() - (existing.expires - 5 * 60 * 1000)) < 60000) {
      return jsonResponse(res, 429, { success: false, message: '请60秒后再试' });
    }

    try {
      const result = await sendVerifyCode(phone);
      jsonResponse(res, 200, { 
        success: true, 
        message: '验证码已发送',
        mock: result.mock,
      });
    } catch (err) {
      jsonResponse(res, 500, { success: false, message: '发送失败: ' + err.message });
    }
    return;
  }

  // POST /api/verify-code  验证验证码
  if (urlPath === '/api/verify-code' && method === 'POST') {
    const body = await parseBody(req);
    const { phone, code } = body;

    if (!phone || !code) {
      return jsonResponse(res, 400, { success: false, message: '参数不完整' });
    }

    const result = verifyCode(phone, code);
    jsonResponse(res, result.valid ? 200 : 400, {
      success: result.valid,
      message: result.reason || '验证成功',
    });
    return;
  }

  // POST /api/login  登录（验证码验证 + 注册）
  if (urlPath === '/api/login' && method === 'POST') {
    const body = await parseBody(req);
    const { phone, code, studentId } = body;

    if (!phone || !code || !studentId) {
      return jsonResponse(res, 400, { success: false, message: '请填写完整信息' });
    }

    // 校验学号格式（可根据实际学校规则调整）
    if (!/^\d{6,12}$/.test(studentId)) {
      return jsonResponse(res, 400, { success: false, message: '请输入正确的学号（6-12位数字）' });
    }

    // 先验证验证码
    const result = verifyCode(phone, code);
    if (!result.valid) {
      return jsonResponse(res, 400, { success: false, message: result.reason });
    }

    // 登录/注册成功，返回用户信息
    // 生产环境这里应该查数据库，这里返回基础信息
    jsonResponse(res, 200, {
      success: true,
      user: {
        studentId,
        phone,
        name: `同学${phone.slice(-4)}`,
        avatar: phone.slice(-1),
        memberSince: new Date().getFullYear().toString(),
        level: '在校学生',
      },
    });
    return;
  }

  // 未知 API
  jsonResponse(res, 404, { success: false, message: 'API 不存在' });
}

// ========== 启动服务器 ==========
const server = http.createServer(async (req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const urlPath = url.pathname;

  // API 路由
  if (urlPath.startsWith('/api/')) {
    await handleAPI(req, res, urlPath, req.method);
    return;
  }

  // 静态文件
  serveStatic(res, urlPath);
});

server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   📷 CameraHub Server                  ║');
  console.log(`║   地址: http://localhost:${PORT}          ║`);
  console.log('║   短信: ' + (SMS_CONFIG.secretId ? '真实发送模式' : '模拟模式（控制台查看）') + '  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  if (!SMS_CONFIG.secretId) {
    console.log('💡 配置真实短信发送（可选）：');
    console.log('   设置环境变量: TENCENT_SECRET_ID, TENCENT_SECRET_KEY');
    console.log('                SMS_SDK_APP_ID, SMS_SIGN_NAME, SMS_TEMPLATE_ID');
    console.log('   详情: https://console.cloud.tencent.com/smsv2');
    console.log('');
  }
});
