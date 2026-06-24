/**
 * CameraHub Mock 数据层
 * 完整器材库、用户评价、订单数据、鉴定报告等
 */
const MockData = {
  categories: [
    { id: 'dslr', name: '单反相机', icon: '📸', desc: '专业级单反相机租赁' },
    { id: 'mirrorless', name: '微单相机', icon: '📷', desc: '轻便高性能微单' },
    { id: 'lens', name: '镜头', icon: '🔭', desc: '各类焦段镜头' },
    { id: 'video', name: '摄像机', icon: '🎥', desc: '专业视频拍摄设备' },
    { id: 'lighting', name: '灯光设备', icon: '💡', desc: '补光灯/闪光灯' },
    { id: 'accessory', name: '配件', icon: '🎒', desc: '三脚架/稳定器/存储' },
  ],

  brands: [
    { id: 'canon', name: 'Canon 佳能' },
    { id: 'nikon', name: 'Nikon 尼康' },
    { id: 'sony', name: 'Sony 索尼' },
    { id: 'fujifilm', name: 'Fujifilm 富士' },
    { id: 'panasonic', name: 'Panasonic 松下' },
    { id: 'sigma', name: 'Sigma 适马' },
    { id: 'tamron', name: 'Tamron 腾龙' },
    { id: 'dj', name: 'DJI 大疆' },
    { id: 'godox', name: 'Godox 神牛' },
    { id: 'manfrotto', name: 'Manfrotto 曼富图' },
  ],

  conditions: [
    { id: 'new', name: '全新', minRating: 95 },
    { id: 'like_new', name: '99新', minRating: 90 },
    { id: 'excellent', name: '95新', minRating: 80 },
    { id: 'good', name: '9成新', minRating: 70 },
  ],

  products: [
    {
      id: 1, category: 'dslr', brand: 'canon', condition: 'like_new', type: 'rent', rating: 92,
      name: 'Canon 专业全画幅微单相机',
      shortName: 'EOS R5',
      specs: { sensor: '4500万像素全画幅CMOS', iso: '100-51200', shutter: '1/8000s', video: '8K RAW', af: '全像素双核AF II', stabilization: '5轴机身防抖', weight: '738g', mount: 'RF卡口' },
      price: { daily: 150, weekly: 900, monthly: 3000, deposit: 5000 },
      images: ['r5-1.webp', 'r5-2.webp', 'r5-3.webp'],
      desc: '佳能旗舰级全画幅微单相机，4500万有效像素带来极致画质表现。支持8K RAW视频录制，配合第二代全像素双核对焦系统，无论是静态摄影还是动态影像创作都游刃有余。',
      stock: 3, sold: 128, listedAt: '2026-01-15',
      reviews: [
        { user: '王摄影师', avatar: '王', rating: 5, date: '2026-05-20', content: '非常棒的机器，8K视频画质惊人，对焦速度飞快。租了三天拍婚礼，客户非常满意。', pics: [] },
        { user: '李明', avatar: '李', rating: 5, date: '2026-05-18', content: 'R5的画质确实没话说，4500万像素后期裁切空间很大。就是文件体积大了点，建议配高速卡。', pics: [] },
        { user: '陈小艺', avatar: '陈', rating: 4, date: '2026-05-12', content: '机器状态很好，几乎全新。电池稍微不太耐用，建议多备一块。整体体验很棒。', pics: [] },
      ]
    },
    {
      id: 2, category: 'dslr', brand: 'nikon', condition: 'excellent', type: 'rent', rating: 88,
      name: 'Nikon 专业全画幅微单相机',
      shortName: 'Z8',
      specs: { sensor: '4570万像素堆栈式CMOS', iso: '64-25600', shutter: '1/32000s', video: '8K/60p', af: '493点混合AF', stabilization: '5轴VR防抖', weight: '910g', mount: 'Z卡口' },
      price: { daily: 140, weekly: 840, monthly: 2800, deposit: 4500 },
      images: ['z8-1.webp', 'z8-2.webp', 'z8-3.webp'],
      desc: '尼康Z8继承了Z9的强大性能，采用堆栈式CMOS传感器，实现惊人的连拍速度和自动对焦性能。机身比Z9更轻便，适合需要高性能又追求便携性的摄影师。',
      stock: 5, sold: 96, listedAt: '2026-02-10',
      reviews: [
        { user: '赵远行', avatar: '赵', rating: 5, date: '2026-05-15', content: 'Z8对焦太强了，拍鸟追焦毫无压力。画质细腻，宽容度超高。', pics: [] },
        { user: '周明', avatar: '周', rating: 4, date: '2026-05-10', content: '比Z9轻不少，性能几乎没缩水。Nikon的RAW文件调色空间很大。', pics: [] },
      ]
    },
    {
      id: 3, category: 'mirrorless', brand: 'sony', condition: 'new', type: 'rent', rating: 95,
      name: 'Sony 全画幅微单相机',
      shortName: 'A7R V',
      specs: { sensor: '6100万像素全画幅Exmor R CMOS', iso: '100-32000', shutter: '1/8000s', video: '8K/24p', af: 'AI智能AF', stabilization: '5轴8级防抖', weight: '723g', mount: 'E卡口' },
      price: { daily: 150, weekly: 900, monthly: 3000, deposit: 5000 },
      images: ['a7r5-1.webp', 'a7r5-2.webp', 'a7r5-3.webp'],
      desc: '索尼旗舰高像素微单，6100万像素带来极致的细节表现力。搭载AI智能芯片，人/动物/鸟类/昆虫等7种主体识别，对焦速度达到新的高度。',
      stock: 2, sold: 156, listedAt: '2026-01-20',
      reviews: [
        { user: '张大师', avatar: '张', rating: 5, date: '2026-06-01', content: '6100万像素拍风光简直无敌，细节表现力惊人。AI对焦识别非常准。', pics: [] },
        { user: '刘洋', avatar: '刘', rating: 5, date: '2026-05-25', content: '配GM镜头简直是画质天花板。租了一周拍商业项目，客户对成片赞不绝口。', pics: [] },
      ]
    },
    {
      id: 4, category: 'mirrorless', brand: 'fujifilm', condition: 'like_new', type: 'rent', rating: 90,
      name: 'Fujifilm 中画幅微单相机',
      shortName: 'GFX100S',
      specs: { sensor: '1.02亿像素中画幅CMOS', iso: '100-12800', shutter: '1/4000s', video: '4K/30p', af: '相位检测AF', stabilization: '5轴6.5级防抖', weight: '900g', mount: 'G卡口' },
      price: { daily: 150, weekly: 900, monthly: 3000, deposit: 5000 },
      images: ['gfx100s-1.webp', 'gfx100s-2.webp', 'gfx100s-3.webp'],
      desc: '富士中画幅旗舰，1.02亿像素带来难以置信的解析力。相比全画幅更大的传感器面积带来更浅的景深和更丰富的色彩过渡，是商业摄影和风光创作的终极选择。',
      stock: 1, sold: 45, listedAt: '2026-03-01',
      reviews: [
        { user: '孙大牛', avatar: '孙', rating: 5, date: '2026-04-20', content: '一亿像素拍出来的片子确实不一样，放大看细节令人震撼。租来拍了一次时装广告，效果超预期。', pics: [] },
      ]
    },
    {
      id: 5, category: 'lens', brand: 'canon', condition: 'excellent', type: 'rent', rating: 91,
      name: 'Canon 远摄变焦镜头',
      shortName: 'RF 70-200 F2.8',
      specs: { focal: '70-200mm', aperture: 'F2.8', filter: '77mm', stabilization: '5级防抖', weight: '1070g', mount: 'RF卡口' },
      price: { daily: 130, weekly: 780, monthly: 2600, deposit: 3000 },
      images: ['rf70200-1.webp', 'rf70200-2.webp'],
      desc: '佳能RF"大三元"远摄变焦镜头，恒定F2.8大光圈，画质锐利色彩出众。相比EF版本更轻更短，携带更方便，是活动跟拍和人像摄影的不二之选。',
      stock: 4, sold: 87, listedAt: '2026-02-20',
      reviews: [
        { user: '黄小明', avatar: '黄', rating: 5, date: '2026-05-08', content: 'RF720绝对是神头，锐度比EF版提升明显，还轻了不少。F2.8虚化很柔美。', pics: [] },
      ]
    },
    {
      id: 6, category: 'lens', brand: 'sony', condition: 'new', type: 'rent', rating: 93,
      name: 'Sony 标准变焦镜头',
      shortName: '24-70 GM II',
      specs: { focal: '24-70mm', aperture: 'F2.8', filter: '82mm', stabilization: '无(机身防抖)', weight: '695g', mount: 'E卡口' },
      price: { daily: 130, weekly: 780, monthly: 2600, deposit: 3000 },
      images: ['2470gm2-1.webp', '2470gm2-2.webp'],
      desc: '索尼第二代G大师标准变焦镜头，大幅减重至695g，画质和自动对焦速度全面提升。是目前最轻便的F2.8标准变焦镜头之一。',
      stock: 3, sold: 112, listedAt: '2026-02-15',
      reviews: [
        { user: '吴师傅', avatar: '吴', rating: 5, date: '2026-05-22', content: '比一代轻了整整200g！画质还更好，索尼用户必租的工作头。', pics: [] },
      ]
    },
    {
      id: 7, category: 'video', brand: 'sony', condition: 'excellent', type: 'rent', rating: 89,
      name: 'Sony 全画幅电影摄影机',
      shortName: 'FX3',
      specs: { sensor: '1210万像素全画幅CMOS', iso: '80-409600', video: '4K/120p', af: '快速混合AF', stabilization: '5轴机身防抖', weight: '715g', mount: 'E卡口' },
      price: { daily: 150, weekly: 900, monthly: 3000, deposit: 5000 },
      images: ['fx3-1.webp', 'fx3-2.webp', 'fx3-3.webp'],
      desc: '索尼专业级电影摄影机，配备主动散热风扇，可长时间录制4K 120p高帧率视频。内置S-Cinetone色彩科学，直出电影感画面，是视频创作者的梦想机型。',
      stock: 2, sold: 64, listedAt: '2026-03-10',
      reviews: [
        { user: '钱导', avatar: '钱', rating: 5, date: '2026-05-30', content: '拍短片租了FX3，色彩科学太舒服了。高感也很强，暗光环境下表现优秀。', pics: [] },
      ]
    },
    {
      id: 8, category: 'lighting', brand: 'godox', condition: 'good', type: 'rent', rating: 84,
      name: 'Godox 150W LED常亮摄影灯',
      shortName: 'SL150W II',
      specs: { power: '150W', cri: '96+', tlc: '97+', brightness: '58000lux@1m', remote: '2.4G无线遥控', weight: '3.5kg' },
      price: { daily: 100, weekly: 600, monthly: 2000, deposit: 1000 },
      images: ['sl150-1.webp', 'sl150-2.webp'],
      desc: '神牛SL150W II是一款高显色指数LED常亮灯，150W大功率配合标准保荣卡口，兼容各类光效附件。适合直播间布光、产品摄影和人像拍摄。',
      stock: 6, sold: 43, listedAt: '2026-04-01',
      reviews: [
        { user: '马小跳', avatar: '马', rating: 4, date: '2026-06-02', content: '性价比很高，150W的亮度对于小工作室来说完全够用。风扇声音不大，录视频不受影响。', pics: [] },
      ]
    },
    {
      id: 9, category: 'accessory', brand: 'dj', condition: 'new', type: 'rent', rating: 92,
      name: 'DJI 专业手持稳定器',
      shortName: 'RS 4 Pro',
      specs: { payload: '4.5kg', battery: '12小时', features: '自动轴锁/蓝牙快门/跟焦电机', weight: '1.4kg', compatible: '主流微单/电影机' },
      price: { daily: 120, weekly: 720, monthly: 2400, deposit: 2000 },
      images: ['rs4pro-1.webp', 'rs4pro-2.webp'],
      desc: '大疆最新一代专业手持稳定器，承重高达4.5kg，可轻松搭载主流微单和轻量电影机。第二代自动轴锁设计，调平和收纳效率大幅提升。',
      stock: 4, sold: 78, listedAt: '2026-03-20',
      reviews: [
        { user: '阿杰', avatar: '杰', rating: 5, date: '2026-05-28', content: 'RS4 Pro比上代好用太多，自动轴锁太方便了。挂A7R5+2470GM很稳。', pics: [] },
      ]
    },
    {
      id: 10, category: 'lens', brand: 'sigma', condition: 'excellent', type: 'rent', rating: 87,
      name: 'Sigma 人像定焦镜头',
      shortName: '85mm F1.4 Art',
      specs: { focal: '85mm', aperture: 'F1.4', filter: '77mm', minFocus: '0.85m', weight: '630g', mount: 'E卡口' },
      price: { daily: 120, weekly: 720, monthly: 2400, deposit: 2500 },
      images: ['sigma85-1.webp', 'sigma85-2.webp'],
      desc: '适马Art系列85mm人像镜皇，F1.4大光圈带来极致虚化效果。全开光圈锐度即达到极高水平，是人像、婚礼摄影师的必备利器。',
      stock: 3, sold: 56, listedAt: '2026-02-25',
      reviews: [
        { user: '林夕', avatar: '林', rating: 5, date: '2026-05-16', content: '适马这颗85真的香，全开锐度就很高。拍人像的背景虚化很美，价格比原厂便宜太多。', pics: [] },
      ]
    },
    {
      id: 11, category: 'dslr', brand: 'canon', condition: 'good', type: 'used', rating: 75,
      name: 'Canon 单反相机 (二手)',
      shortName: '5D Mark IV',
      specs: { sensor: '3040万像素全画幅CMOS', iso: '100-32000', shutter: '1/8000s', video: '4K/30p', af: '61点AF', shutterCount: '约45000次', weight: '890g' },
      price: { sell: 5200, original: 18999, deposit: 0 },
      images: ['5d4-1.webp', '5d4-2.webp', '5d4-3.webp'],
      desc: '自用佳能5D Mark IV，快门约45,000次，机身轻微使用痕迹，功能一切正常。配件齐全含原厂电池x2、充电器、肩带。因升级R5故出。9成新，实用成色。',
      seller: { name: '老法师', rating: 4.8, trades: 23, joined: '2025-03' },
      stock: 1, sold: 0, listedAt: '2026-05-15', location: '北京',
      reviews: []
    },
    {
      id: 12, category: 'lens', brand: 'nikon', condition: 'excellent', type: 'used', rating: 85,
      name: 'Nikon 镜头 (二手)',
      shortName: '24-70 F2.8 VR',
      specs: { focal: '24-70mm', aperture: 'F2.8', filter: '82mm', stabilization: 'VR防抖', weight: '1070g', usageYears: '2年' },
      price: { sell: 4200, original: 12999, deposit: 0 },
      images: ['n2470-1.webp', 'n2470-2.webp'],
      desc: 'Nikon金圈24-70 F2.8 VR版，镜片通透无霉无划，变焦顺滑，VR防抖工作正常。95新成色，带原厂遮光罩和前后盖。',
      seller: { name: 'N家铁粉', rating: 4.9, trades: 15, joined: '2025-06' },
      stock: 1, sold: 0, listedAt: '2026-06-05', location: '上海',
      reviews: []
    },
    {
      id: 13, category: 'mirrorless', brand: 'sony', condition: 'like_new', type: 'used', rating: 90,
      name: 'Sony 全画幅微单相机 (二手)',
      shortName: 'A7M4',
      specs: { sensor: '3300万像素全画幅CMOS', iso: '100-51200', shutter: '1/8000s', video: '4K/60p', af: '759点相位检测', shutterCount: '约12000次', weight: '658g' },
      price: { sell: 9800, original: 16999, deposit: 0 },
      images: ['a7m4-1.webp', 'a7m4-2.webp', 'a7m4-3.webp'],
      desc: '99新A7M4，快门仅12,000次左右。箱说全，带原厂电池x1、充电器、肩带，屏幕已贴膜。因升级A7R5转让，性价比极高。',
      seller: { name: '索尼大法好', rating: 4.7, trades: 8, joined: '2025-09' },
      stock: 1, sold: 0, listedAt: '2026-06-10', location: '深圳',
      reviews: []
    },
    {
      id: 14, category: 'accessory', brand: 'manfrotto', condition: 'good', type: 'used', rating: 78,
      name: 'Manfrotto 专业三脚架 (二手)',
      shortName: '055XPROB',
      specs: { material: '铝合金', height: '178cm(含中轴)', load: '7kg', weight: '2.4kg', sections: '3节' },
      price: { sell: 450, original: 1580, deposit: 0 },
      images: ['mf055-1.webp', 'mf055-2.webp'],
      desc: '曼富图经典款055系列三脚架，结实耐用，承重7kg。9成新，有正常使用痕迹，各锁紧旋钮工作正常。不含云台。',
      seller: { name: '二手达人', rating: 4.5, trades: 31, joined: '2025-01' },
      stock: 1, sold: 0, listedAt: '2026-06-08', location: '广州',
      reviews: []
    },
    {
      id: 15, category: 'mirrorless', brand: 'fujifilm', condition: 'excellent', type: 'used', rating: 86,
      name: 'Fujifilm 微单相机 (二手)',
      shortName: 'X-T5',
      specs: { sensor: '4020万像素APS-C X-Trans CMOS 5 HR', iso: '125-12800', shutter: '1/180000s(电子)', video: '6.2K/30p', af: '425点智能AF', shutterCount: '约8000次', weight: '557g' },
      price: { sell: 7800, original: 12190, deposit: 0 },
      images: ['xt5-1.webp', 'xt5-2.webp'],
      desc: '95新富士X-T5，快门仅8000次。经典复古外观，4020万像素X-Trans传感器直出色彩绝美。箱说齐全，含原厂电池和充电器。',
      seller: { name: '胶片情怀', rating: 4.9, trades: 12, joined: '2025-07' },
      stock: 1, sold: 0, listedAt: '2026-06-12', location: '成都',
      reviews: []
    },
    {
      id: 16, category: 'lens', brand: 'canon', condition: 'good', type: 'used', rating: 72,
      name: 'Canon 人像镜头 (二手)',
      shortName: 'EF 50 F1.2L',
      specs: { focal: '50mm', aperture: 'F1.2', filter: '72mm', minFocus: '0.45m', weight: '580g', mount: 'EF卡口', usageYears: '5年' },
      price: { sell: 3800, original: 10999, deposit: 0 },
      images: ['ef50-1.webp', 'ef50-2.webp'],
      desc: '佳能红圈人像镜皇，F1.2梦幻虚化。镜身有正常使用痕迹，镜片微灰不影响成像。对焦环略松但AF正常。含前后盖遮光罩，实用主义首选。',
      seller: { name: '红圈收藏家', rating: 4.6, trades: 19, joined: '2025-04' },
      stock: 1, sold: 0, listedAt: '2026-06-14', location: '杭州',
      reviews: []
    },
    {
      id: 17, category: 'dslr', brand: 'nikon', condition: 'good', type: 'used', rating: 70,
      name: 'Nikon D850 专业全画幅单反 (二手)',
      shortName: 'D850',
      specs: { sensor: '4575万像素全画幅CMOS', iso: '64-25600', shutter: '1/8000s', video: '4K/30p', af: '153点AF', shutterCount: '约68000次', weight: '1005g' },
      price: { sell: 6500, original: 21999, deposit: 0 },
      images: ['d850-1.webp', 'd850-2.webp'],
      desc: '尼康单反巅峰之作D850，4575万像素风光利器。快门68000次，外观有使用痕迹但功能完美。含原厂电池x2、充电器。实用党首选。',
      seller: { name: '风光老炮', rating: 4.7, trades: 28, joined: '2025-02' },
      stock: 1, sold: 0, listedAt: '2026-06-13', location: '武汉',
      reviews: []
    },
    {
      id: 18, category: 'lens', brand: 'sony', condition: 'like_new', type: 'used', rating: 92,
      name: 'Sony 镜头 (二手)',
      shortName: '70-200 GM II',
      specs: { focal: '70-200mm', aperture: 'F2.8', filter: '77mm', stabilization: 'OSS防抖', weight: '1045g', mount: 'E卡口', usageMonths: '3个月' },
      price: { sell: 13800, original: 18999, deposit: 0 },
      images: ['fe7200gm2-1.webp', 'fe7200gm2-2.webp'],
      desc: '99新索尼70-200 GM二代，买来仅用3个月拍了两场活动。镜片完美，变焦丝滑。箱说全，含原厂遮光罩、脚架环。升级大炮故出。',
      seller: { name: '体育摄影师', rating: 4.9, trades: 7, joined: '2026-01' },
      stock: 1, sold: 0, listedAt: '2026-06-15', location: '北京',
      reviews: []
    },
    {
      id: 19, category: 'accessory', brand: 'dj', condition: 'excellent', type: 'used', rating: 83,
      name: 'DJI 轻量手持稳定器 (二手)',
      shortName: 'RS 3 Mini',
      specs: { payload: '2kg', battery: '10小时', features: '蓝牙快门/原生竖拍', weight: '795g', compatible: '微单/卡片机', usageMonths: '6个月' },
      price: { sell: 1200, original: 1999, deposit: 0 },
      images: ['rs3mini-1.webp', 'rs3mini-2.webp'],
      desc: '95新大疆RS 3 Mini，轻便稳定器。用了半年，功能完好电池给力。支持原生竖拍，Vlog神器。含原厂收纳包和快装板。',
      seller: { name: 'Vlog达人', rating: 4.6, trades: 14, joined: '2025-08' },
      stock: 1, sold: 0, listedAt: '2026-06-16', location: '广州',
      reviews: []
    },
    {
      id: 20, category: 'lighting', brand: 'godox', condition: 'like_new', type: 'used', rating: 90,
      name: 'Godox V1 Pro 圆头机顶闪光灯 (二手)',
      shortName: 'V1 Pro',
      specs: { power: '76Ws', guide: 'GN60', battery: '480次全光', remote: '2.4G X无线系统', features: '圆头/磁吸附件/造型灯', usageMonths: '2个月' },
      price: { sell: 680, original: 1280, deposit: 0 },
      images: ['v1pro-1.webp', 'v1pro-2.webp'],
      desc: '99新神牛V1 Pro，买了只用过两次。圆头闪光柔美自然，磁吸附件系统超方便。含原厂电池、充电器和收纳包。换Profoto故出。',
      seller: { name: '婚礼摄影师', rating: 4.8, trades: 21, joined: '2025-05' },
      stock: 1, sold: 0, listedAt: '2026-06-17', location: '上海',
      reviews: []
    },
    {
      id: 21, category: 'video', brand: 'dj', condition: 'excellent', type: 'rent', rating: 90,
      name: 'DJI 口袋云台相机创作套装',
      shortName: 'Pocket 3',
      specs: { sensor: '1英寸CMOS', video: '4K/120fps', stabilization: '3轴云台', screen: '2英寸旋转屏', features: 'ActiveTrack 6.0', weight: '179g' },
      price: { daily: 100, weekly: 600, monthly: 2000, deposit: 1500 },
      images: ['pocket3-1.webp', 'pocket3-2.webp'],
      desc: '大疆口袋云台相机第三代，1英寸大底传感器画质飞跃提升。旋转屏幕方便自拍Vlog，全新ActiveTrack 6.0智能跟随更精准。Vlog创作利器。',
      stock: 5, sold: 89, listedAt: '2026-04-10',
      reviews: [
        { user: 'Vlog小新', avatar: '新', rating: 5, date: '2026-06-05', content: 'Pocket 3真的太方便了，1英寸底画质完爆手机。出门旅游只带它就够了。', pics: [] },
      ]
    },
    {
      id: 22, category: 'lighting', brand: 'godox', condition: 'like_new', type: 'rent', rating: 88,
      name: 'Godox 外拍闪光灯套装',
      shortName: 'AD600Pro',
      specs: { power: '600Ws', flashDuration: '1/10000s', powerRange: '1/256-1/1', battery: '500次全光', remote: '内置2.4G X系统', weight: '3.6kg(含电池)' },
      price: { daily: 120, weekly: 720, monthly: 2400, deposit: 3000 },
      images: ['ad600-1.webp', 'ad600-2.webp'],
      desc: '神牛AD600Pro外拍灯，600Ws大功率配合高速同步，户外压光利器。内置神牛2.4G无线X系统，兼容所有神牛引闪器。含标准罩和电池。',
      stock: 2, sold: 35, listedAt: '2026-04-15',
      reviews: [
        { user: '大峰', avatar: '峰', rating: 5, date: '2026-05-29', content: '外拍必备，600Ws功率够大，高速同步HSS很实用。电池也耐用。', pics: [] },
      ]
    },
  ],

  authenticateCases: [
    {
      id: 'AUTH-001', productName: 'Canon EOS R5', applicant: '张先生', submitDate: '2026-06-10',
      status: 'completed', result: 'pass',
      report: {
        conclusion: '经鉴定，该设备为佳能正品行货，外观无拆修痕迹，功能检测全部正常。',
        details: { appearance: '机身轻微使用痕迹，无磕碰无划痕', function: '全部功能正常', sensor: 'CMOS无坏点', shutter: '快门测试正常', mount: '卡口无磨损', accessories: '原厂配件齐全' },
        inspector: '李明华', inspectDate: '2026-06-12'
      }
    },
    {
      id: 'AUTH-002', productName: 'Sony A7M4', applicant: '刘女士', submitDate: '2026-06-08',
      status: 'completed', result: 'pass',
      report: {
        conclusion: '经鉴定，该设备为索尼国行正品，核心部件无维修痕迹，各项参数指标正常。',
        details: { appearance: '外观成色极好，几近全新', function: '全部功能正常', sensor: 'CMOS无坏点无灰尘', shutter: '快门次数约8500，正常', mount: '卡口紧致无松动', accessories: '原厂电池、充电器、肩带齐全' },
        inspector: '王建国', inspectDate: '2026-06-09'
      }
    },
    {
      id: 'AUTH-003', productName: 'Nikon 全画幅微单相机', applicant: '陈同学', submitDate: '2026-06-15',
      status: 'pending', result: null,
      report: null
    },
  ],

  orders: [
    { id: 'ORD-001', productId: 1, productName: 'Canon EOS R5', productImg: 'r5-1.webp', period: 'weekly', days: 7, price: 900, deposit: 5000, status: 'renting', startDate: '2026-06-10', endDate: '2026-06-17', createdAt: '2026-06-08' },
    { id: 'ORD-002', productId: 5, productName: 'Canon RF 70-200mm F2.8 L', productImg: 'rf70200-1.webp', period: 'daily', days: 3, price: 390, deposit: 3000, status: 'completed', startDate: '2026-05-20', endDate: '2026-05-23', createdAt: '2026-05-18' },
    { id: 'ORD-003', productId: 3, productName: 'Sony A7R V', productImg: 'a7r5-1.webp', period: 'daily', days: 1, price: 150, deposit: 5000, status: 'completed', startDate: '2026-06-01', endDate: '2026-06-02', createdAt: '2026-05-30' },
    { id: 'ORD-004', productId: 11, productName: 'Canon 5D Mark IV (二手)', productImg: '5d4-1.webp', period: null, days: 0, price: 5200, deposit: 0, status: 'completed', startDate: null, endDate: null, createdAt: '2026-06-12', isPurchase: true },
  ],

  agreements: {
    rental: {
      title: '相机租赁服务协议',
      content: `
        <h4>一、服务说明</h4>
        <p>CameraHub平台（以下简称"本平台"）提供摄影器材租赁居间服务。用户通过本平台租赁器材，需遵守本协议约定。</p>
        <h4>二、租期与费用</h4>
        <p>1. 租期以网站展示的可选周期为准，支持按天、按周、按月租赁。</p>
        <p>2. 租金需在下单时全额支付。延期归还将按日租金的1.5倍收取超期费用。</p>
        <p>3. 提前归还不予退还剩余租期租金。</p>
        <h4>三、押金规则</h4>
        <p>1. 押金金额根据器材价值自动核算，下单时冻结，归还验收合格后24小时内原路退还。</p>
        <p>2. 若器材出现人为损坏、遗失或配件缺失，将根据实际维修/赔偿金额从押金中扣除。</p>
        <h4>四、器材验收与归还</h4>
        <p>1. 取件时请当面检查器材外观和功能，确认无误后签收。</p>
        <p>2. 归还时需保持器材清洁，配件齐全。如有异常请主动说明。</p>
        <h4>五、责任与赔偿</h4>
        <p>1. 正常使用磨损不追究责任，人为损坏按维修报价赔偿。</p>
        <p>2. 器材遗失按器材当前市场价值的100%赔偿。</p>
        <h4>六、其他</h4>
        <p>本协议最终解释权归CameraHub平台所有。如有争议，协商解决，协商不成提交平台所在地人民法院裁决。</p>
      `
    },
    trading: {
      title: '二手交易服务协议',
      content: `
        <h4>一、平台角色</h4>
        <p>CameraHub作为第三方平台，为买卖双方提供信息展示和交易撮合服务，不直接参与商品买卖。</p>
        <h4>二、卖家义务</h4>
        <p>1. 如实描述商品成色、瑕疵、使用情况，不得隐瞒或虚假宣传。</p>
        <p>2. 上传的商品图片需为实物拍摄，不得使用网络图片代替。</p>
        <p>3. 交易达成后需在48小时内发货，并保证包装安全。</p>
        <h4>三、买家权利</h4>
        <p>1. 收货后48小时内可发起退货申请（商品与描述不符或存在未说明瑕疵）。</p>
        <p>2. 可选择申请平台保真鉴定服务，费用由申请方承担。</p>
        <h4>四、保真鉴定</h4>
        <p>1. 平台联合专业检测机构提供器材保真鉴定服务。</p>
        <p>2. 鉴定内容包括但不限于：外观检测、功能检测、传感器坏点检测、快门次数读取、配件真伪核验。</p>
        <p>3. 鉴定周期：3-5个工作日，鉴定报告具有法律效力。</p>
        <h4>五、纠纷处理</h4>
        <p>平台提供交易纠纷调解服务，必要时可冻结交易款项，配合双方协商解决。</p>
      `
    }
  },

  faq: [
    { q: '租赁器材需要什么条件？', a: '只需完成实名认证并支付租金和押金即可租赁，无需抵押证件。' },
    { q: '押金什么时候退还？', a: '归还器材后，我们会24小时内完成验收，验收通过后押金即时原路退还。' },
    { q: '可以提前归还吗？', a: '可以提前归还，但剩余租期租金不予退还。建议合理规划使用时间。' },
    { q: '器材损坏了怎么办？', a: '如发生意外损坏，请及时联系客服说明情况。正常使用磨损无需赔偿，人为损坏根据维修报价从押金中扣除。' },
    { q: '二手器材如何保真？', a: '平台支持保真鉴定服务，由专业检测师对器材进行全面检测并出具鉴定报告。建议购买二手器材前申请鉴定。' },
    { q: '下单后多久可以取到器材？', a: '北京/上海/深圳/广州支持同城当日达，其他城市1-2个工作日。具体以物流信息为准。' },
  ],
};
