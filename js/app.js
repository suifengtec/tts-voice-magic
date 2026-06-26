let selectedFile = null;
let currentInputMethod = 'text'; // 'text' or 'file'
let currentMode = 'tts'; // 'tts' or 'transcription'
let selectedAudioFile = null;
let transcriptionToken = null;
let currentLanguage = 'en'; // 默认语言

// ========== Toast 通知系统 ==========
function initToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 3000) {
    initToastContainer();
    const container = document.querySelector('.toast-container');

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========== 主题切换功能 ==========
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 初始化主题
initTheme();

// 国际化翻译数据 (仅保留中英两种语言)
const translations = {
    en: {
        'page.title': 'EdgeTTS - AI-Powered Voice Processing Platform',
        'page.description': 'EdgeTTS is an AI-powered platform that converts text to speech and speech to text with 90+ voice options in 8 languages, lightning fast processing, completely free to use.',
        'page.keywords': 'text to speech,AI voice synthesis,online TTS,voice generator,free voice tools,speech to text,voice transcription',
        'lang.current': 'English',
        'lang.en': 'English',
        'lang.zh': '中文',
        'header.title': 'EdgeTTS',
        'header.subtitle': 'AI-Powered Voice Processing Platform',
        'header.feature1': '90+ Voice Options',
        'header.feature2': 'Lightning Fast',
        'header.feature3': 'Completely Free',
        'header.feature4': 'Download Support',
        'mode.tts': 'Text to Speech',
        'mode.transcription': 'Speech to Text',
        'input.label': 'Select Input Method',
        'input.manual': 'Manual Input',
        'input.upload': 'Upload File',
        'input.ssml': 'SSML',
        'ssml.label': 'SSML Markup',
        'ssml.exampleBtn': 'Example',
        'ssml.exampleTitle': 'Insert an SSML example',
        'ssml.placeholder': 'Paste a complete SSML document. Voice/speed/pitch/style controls below are ignored in SSML mode.',
        'ssml.hint': 'SSML mode passes raw markup directly to Microsoft TTS. Supports <break>, <prosody>, <say-as>, <emphasis>, <sub>, <phoneme>, <mstts:express-as> and more. Max 8KB.',
        'error.emptySsml': 'Please enter SSML markup',
        'text.label': 'Input Text',
        'text.placeholder': 'Enter text to convert to speech. Insert directives like [pause:500ms], [emphasis:strong]important[/emphasis], [rate:slow]...[/rate]. Click "Directives" above for the full cheat sheet.',
        'voice.label': 'Voice Selection',
        'speed.label': 'Speed Adjustment',
        'speed.verySlow': 'Very Slow',
        'speed.slow': 'Slow',
        'speed.normal': 'Normal',
        'speed.fast': 'Fast',
        'speed.veryFast': 'Very Fast',
        'pitch.label': 'Pitch Adjustment',
        'pitch.veryLow': 'Very Low',
        'pitch.low': 'Low',
        'pitch.normal': 'Normal',
        'pitch.high': 'High',
        'pitch.veryHigh': 'Very High',
        'style.label': 'Voice Style',
        'style.general': 'General',
        'style.assistant': 'Assistant',
        'style.chat': 'Chat',
        'style.customerservice': 'Customer Service',
        'style.newscast': 'Newscast',
        'style.affectionate': 'Affectionate',
        'style.calm': 'Calm',
        'style.cheerful': 'Cheerful',
        'style.gentle': 'Gentle',
        'style.lyrical': 'Lyrical',
        'style.serious': 'Serious',
        'btn.generate': 'Generate Voice',
        'btn.generating': 'Generating...',
        'btn.download': 'Download Audio',
        'btn.transcribe': 'Start Transcription',
        'btn.transcribing': 'Transcribing...',
        'btn.copy': 'Copy Text',
        'btn.copied': 'Copied',
        'btn.edit': 'Edit Text',
        'btn.save': 'Save Edit',
        'btn.useForTts': 'Convert to Speech',
        'error.emptyText': 'Please enter text to convert',
        'error.noFile': 'Please select a file to upload',
        'error.noAudioFile': 'Please select an audio file to transcribe',
        'error.invalidFileType': 'Please select a txt file',
        'error.fileTooLarge': 'File size cannot exceed 500KB',
        'error.audioFileTooLarge': 'Audio file size cannot exceed 10MB',
        'error.invalidAudioType': 'Please select an audio file (mp3, wav, m4a, flac, aac, ogg, webm, amr, 3gp)',
        'error.emptyTranscription': 'Transcription result is empty',
        'error.customTokenRequired': 'Please enter custom token',
        'loading.generating': 'Generating voice, please wait...',
        'loading.longText': 'Processing long text, please wait...',
        'loading.transcribing': 'Transcribing audio, please wait...',
        'loading.fileProcessing': 'Processing uploaded file...',
        'loading.textLength': 'Text length: {count} chars',
        'loading.textLengthEstimate': 'Text length: {count} chars, estimated {seconds} seconds',
        'loading.fileInfo': 'File: {name} ({size})',
        'file.label': 'Upload txt file',
        'file.dropText': 'Drag txt file here or click to select',
        'file.dropHint': 'Supports txt format, max 500KB',
        'file.audioLabel': 'Upload Audio File',
        'file.audioDropText': 'Drag audio file here or click to select',
        'file.audioDropHint': 'Supports mp3, wav, m4a, flac, aac, ogg, webm, amr, 3gp, max 10MB',
        'error.generateFailed': 'Generation failed',
        'error.transcribeFailed': 'Transcription failed',
        'error.requestTooLong': 'Error: Text too long, too many subrequests. Please shorten or split the text.',
        'error.requestTooFrequent': 'Error: Too many requests. Please try again later.',
        'error.prefix': 'Error: ',
        'token.label': 'API Token Configuration',
        'token.default': 'Use Default Token',
        'token.custom': 'Use Custom Token (SiliconFlow)',
        'token.placeholder': 'Enter your API token (optional)',
        'result.label': 'Transcription Result',
        'result.placeholder': 'Transcription result will appear here...',
        'result.success': 'Generation successful!',
        'result.transcriptionSuccess': 'Transcription successful!',
        'wechat.follow': 'Follow WeChat',
        'wechat.scanCode': 'Scan to follow',
        'promo.title': 'Generation successful! Like this tool?',
        'promo.subtitle': 'Follow us for more AI tools and tech updates',
        'promo.accountName': 'Follow our WeChat Account',
        'promo.accountDesc': 'Get more practical AI tools, tutorials and exclusive resources',
        'promo.feature1': 'Latest AI tool recommendations and tutorials',
        'promo.feature2': 'Cutting-edge tech analysis and practical cases',
        'promo.feature3': 'Exclusive resources and source code sharing',
        'promo.feature4': 'Tech Q&A and community discussions',
        'voice.group.chinese': 'Chinese',
        'voice.group.english': 'English',
        'voice.group.japanese': 'Japanese',
        'voice.group.korean': 'Korean',
        'voice.group.french': 'French',
        'voice.group.german': 'German',
        'voice.group.spanish': 'Spanish',
        'voice.group.russian': 'Russian',
        'pause.helpButton': 'Pause syntax',
        'pause.modalTitle': 'Insert pauses in your text',
        'pause.modalIntro': 'Add these markers anywhere in your text. The generated speech will pause exactly there.',
        'pause.exMs': 'Exact milliseconds (max 5000ms)',
        'pause.exSec': 'Seconds, decimals supported',
        'pause.exStrength': 'By strength',
        'pause.exDefault': 'Default medium pause',
        'pause.exampleLabel': 'Example:',
        'pause.limits': 'Up to 5 seconds per pause, max 20 pauses per request, total pause time capped at 30 seconds.',
        'pause.dontShowAgain': 'Don\u2019t show this again',
        'pause.gotIt': 'Got it',
        'marker.helpButton': 'Directives',
        'marker.modalTitle': 'Speech directives in your text',
        'marker.modalIntro': 'Insert these markers in your text to control pauses, emphasis, rate, pitch, emotion, pronunciation and more. Style: [name:value]content[/name]; pause is self-closing.',
        'marker.section.pause': '\u23f8 Pause (self-closing)',
        'marker.section.emphasis': '\ud83d\udcaa Emphasis',
        'marker.section.prosody': '\ud83c\udf9a Rate / Pitch / Volume',
        'marker.section.style': '\ud83c\udfad Emotion style (only on selected Chinese voices)',
        'marker.section.sayas': '\ud83d\udd22 Pronunciation say-as',
        'marker.section.sub': '\ud83d\udd01 Substitution sub',
        'marker.pause.ms': 'Exact milliseconds (max 5000ms)',
        'marker.pause.sec': 'Seconds, decimals supported',
        'marker.pause.strength': 'By strength (x-weak ~ x-strong)',
        'marker.pause.default': 'Default medium pause',
        'marker.emphasis.levels': 'level: reduced / moderate / strong / x-strong',
        'marker.rate': 'x-slow / slow / medium / fast / x-fast or \u00b1N% (e.g. +50%)',
        'marker.pitch': 'high / low or \u00b1NHz / \u00b1N% / \u00b1Nst (semitones)',
        'marker.volume': 'silent / soft / loud / x-loud or \u00b1NdB',
        'marker.style.basic': 'cheerful / sad / angry / calm / serious / chat / customerservice ...',
        'marker.style.degree': 'Optional degree 0.01 \u2013 2.0',
        'marker.sayas.digits': 'Read digits one by one',
        'marker.sayas.tel': 'Phone number',
        'marker.sayas.date': 'Date',
        'marker.sayas.chars': 'Read character by character',
        'marker.sub.example': 'Speak "bj" as "Beijing"',
        'marker.exampleLabel': 'Combined example:',
        'marker.limits': 'Invalid or unclosed markers are kept as plain text (no errors). Up to 5s per pause, total pause \u2264 30s, max 50 directives per request. For phoneme / lang / audio / lexicon, use SSML mode.',
        'tip.topLink': 'Buy me a coffee',
        'tip.title': 'Like this tool? Buy me a coffee',
        'tip.desc': 'This service is completely free. Your support keeps it running.',
        'tip.scanCaption': 'Scan with WeChat'
    },
    zh: {
        'page.title': 'EdgeTTS - AI驱动的语音处理平台',
        'page.description': 'EdgeTTS是一个AI驱动的平台，支持文字转语音和语音转文字，拥有8种语言90+种语音选项，闪电般的处理速度，完全免费使用。',
        'page.keywords': '文字转语音,AI语音合成,在线TTS,语音生成器,免费语音工具,语音转文字,语音转录',
        'lang.current': '中文',
        'lang.en': 'English',
        'lang.zh': '中文',
        'header.title': 'EdgeTTS',
        'header.subtitle': 'AI驱动的语音处理平台',
        'header.feature1': '90+种语音选项',
        'header.feature2': '闪电般快速',
        'header.feature3': '完全免费',
        'header.feature4': '支持下载',
        'mode.tts': '文字转语音',
        'mode.transcription': '语音转文字',
        'input.label': '选择输入方式',
        'input.manual': '手动输入',
        'input.upload': '上传文件',
        'input.ssml': 'SSML',
        'ssml.label': 'SSML 标记',
        'ssml.exampleBtn': '示例',
        'ssml.exampleTitle': '插入 SSML 示例',
        'ssml.placeholder': '直接粘贴完整 SSML 文档。SSML 模式下，下方的语音/语速/音调/风格控件不再生效。',
        'ssml.hint': 'SSML 模式会把标记原样发送给 Microsoft TTS，支持 <break>、<prosody>、<say-as>、<emphasis>、<sub>、<phoneme>、<mstts:express-as> 等标签。最大 8KB。',
        'error.emptySsml': '请输入 SSML 标记',
        'text.label': '输入文本',
        'text.placeholder': '请输入要转换的文本内容。可插入指令：[pause:500ms]、[emphasis:strong]重点[/emphasis]、[rate:slow]...[/rate] 等。点击上方"指令用法"查看完整速查卡。',
        'voice.label': '语音选择',
        'speed.label': '语速调节',
        'speed.verySlow': '很慢',
        'speed.slow': '慢速',
        'speed.normal': '正常',
        'speed.fast': '快速',
        'speed.veryFast': '很快',
        'pitch.label': '音调高低',
        'pitch.veryLow': '很低沉',
        'pitch.low': '低沉',
        'pitch.normal': '标准',
        'pitch.high': '高亢',
        'pitch.veryHigh': '很高亢',
        'style.label': '语音风格',
        'style.general': '通用风格',
        'style.assistant': '智能助手',
        'style.chat': '聊天对话',
        'style.customerservice': '客服专业',
        'style.newscast': '新闻播报',
        'style.affectionate': '亲切温暖',
        'style.calm': '平静舒缓',
        'style.cheerful': '愉快欢乐',
        'style.gentle': '温和柔美',
        'style.lyrical': '抒情诗意',
        'style.serious': '严肃正式',
        'btn.generate': '开始生成语音',
        'btn.generating': '生成中...',
        'btn.download': '下载音频文件',
        'btn.transcribe': '开始语音转录',
        'btn.transcribing': '转录中...',
        'btn.copy': '复制文本',
        'btn.copied': '已复制',
        'btn.edit': '编辑文本',
        'btn.save': '保存编辑',
        'btn.useForTts': '转为语音',
        'error.emptyText': '请输入要转换的文本内容',
        'error.noFile': '请选择要上传的txt文件',
        'error.noAudioFile': '请选择要转录的音频文件',
        'error.invalidFileType': '请选择txt格式的文本文件',
        'error.fileTooLarge': '文件大小不能超过500KB',
        'error.audioFileTooLarge': '音频文件大小不能超过10MB',
        'error.invalidAudioType': '请选择音频格式的文件（mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp）',
        'error.emptyTranscription': '转录结果为空，无法转换为语音',
        'error.customTokenRequired': '请输入自定义Token',
        'loading.generating': '正在生成语音，请稍候...',
        'loading.longText': '正在处理长文本，请耐心等待...',
        'loading.transcribing': '正在转录音频，请稍候...',
        'loading.fileProcessing': '正在处理上传的文件...',
        'loading.textLength': '文本长度: {count} 字符',
        'loading.textLengthEstimate': '文本长度: {count} 字符，预计需要 {seconds} 秒',
        'loading.fileInfo': '文件: {name} ({size})',
        'file.label': '上传txt文件',
        'file.dropText': '拖拽txt文件到此处，或点击选择文件',
        'file.dropHint': '支持txt格式，最大500KB',
        'file.audioLabel': '上传音频文件',
        'file.audioDropText': '拖拽音频文件到此处，或点击选择文件',
        'file.audioDropHint': '支持mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp格式，最大10MB',
        'error.generateFailed': '生成失败',
        'error.transcribeFailed': '转录失败',
        'error.requestTooLong': '错误: 文本过长导致请求过多，请缩短文本内容或分段处理',
        'error.requestTooFrequent': '错误: 请求过于频繁，请稍后再试',
        'error.prefix': '错误: ',
        'token.label': 'API Token配置',
        'token.default': '使用默认Token',
        'token.custom': '使用硅基流动自定义Token',
        'token.placeholder': '输入您的API Token（可选）',
        'result.label': '转录结果',
        'result.placeholder': '转录结果将在这里显示...',
        'result.success': '生成成功！',
        'result.transcriptionSuccess': '转录成功！',
        'wechat.follow': '关注公众号',
        'wechat.scanCode': '扫码关注',
        'promo.title': '生成成功！喜欢这个工具吗？',
        'promo.subtitle': '关注我们获取更多AI工具和技术分享',
        'promo.accountName': '关注「一只会飞的旺旺」公众号',
        'promo.accountDesc': '获取更多实用的AI工具、技术教程和独家资源分享',
        'promo.feature1': '最新AI工具推荐和使用教程',
        'promo.feature2': '前沿技术解析和实战案例',
        'promo.feature3': '独家资源和工具源码分享',
        'promo.feature4': '技术问题答疑和交流社群',
        'voice.group.chinese': '中文',
        'voice.group.english': '英语',
        'voice.group.japanese': '日语',
        'voice.group.korean': '韩语',
        'voice.group.french': '法语',
        'voice.group.german': '德语',
        'voice.group.spanish': '西班牙语',
        'voice.group.russian': '俄语',
        'pause.helpButton': '停顿用法',
        'pause.modalTitle': '在文本中插入停顿',
        'pause.modalIntro': '在任意位置插入下面这些标记，生成的语音就会在该处停顿。',
        'pause.exMs': '精确毫秒（最大 5000ms）',
        'pause.exSec': '秒，支持小数',
        'pause.exStrength': '按强度',
        'pause.exDefault': '默认中等停顿',
        'pause.exampleLabel': '示例：',
        'pause.limits': '单次停顿最长 5 秒，每段文本最多 20 个停顿，总停顿时长不超过 30 秒。',
        'pause.dontShowAgain': '不再自动显示',
        'pause.gotIt': '知道了',
        'marker.helpButton': '指令用法',
        'marker.modalTitle': '在文本中插入语音指令',
        'marker.modalIntro': '在文本中插入下面这些标记，可以精确控制停顿、重音、语速、音调、情感、朗读方式等。语法整体风格：[名字:值]内容[/名字]，pause 是自闭合的。',
        'marker.section.pause': '⏸ 停顿（自闭合）',
        'marker.section.emphasis': '💪 重音 emphasis',
        'marker.section.prosody': '🎚 语速 / 音调 / 音量',
        'marker.section.style': '🎭 情感风格 style（仅部分中文 voice 支持）',
        'marker.section.sayas': '🔢 朗读方式 say-as',
        'marker.section.sub': '🔁 别名替换 sub',
        'marker.pause.ms': '精确毫秒（最大 5000ms）',
        'marker.pause.sec': '秒，支持小数',
        'marker.pause.strength': '按强度（x-weak ~ x-strong）',
        'marker.pause.default': '默认中等停顿',
        'marker.emphasis.levels': 'level: reduced / moderate / strong / x-strong',
        'marker.rate': 'x-slow / slow / medium / fast / x-fast 或 ±N%（如 +50%）',
        'marker.pitch': 'high / low 或 ±NHz / ±N% / ±Nst（半音）',
        'marker.volume': 'silent / soft / loud / x-loud 或 ±NdB',
        'marker.style.basic': 'cheerful / sad / angry / calm / serious / chat / customerservice ...',
        'marker.style.degree': '可选强度 0.01 ~ 2.0',
        'marker.sayas.digits': '逐字读数字',
        'marker.sayas.tel': '电话号码',
        'marker.sayas.date': '日期',
        'marker.sayas.chars': '逐字母读',
        'marker.sub.example': '把 "bj" 读作 "北京"',
        'marker.exampleLabel': '综合示例：',
        'marker.limits': '值不合法或未闭合时，该标记会原样保留为文本（不会报错）。单次停顿最长 5 秒，整段总停顿 ≤ 30 秒，全部指令上限 50 个。需要更复杂的标签（phoneme / lang / audio / 自定义词典）请用 SSML 模式。',
        'tip.topLink': '请作者喝杯咖啡',
        'tip.title': '喜欢这个工具？请作者喝杯咖啡',
        'tip.desc': '本服务完全免费，您的赞赏是持续维护的最大动力',
        'tip.scanCaption': '微信扫码赞赏'
    }
};

const fileSizeUnits = {
    en: ['Bytes', 'KB', 'MB'],
    zh: ['字节', 'KB', 'MB']
};

function t(key, params) {
    const langData = translations[currentLanguage] || {};
    let text = langData[key] || translations.en?.[key] || key;

    if (params) {
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
        });
    }

    return text;
}

function getFileSizeUnits() {
    return fileSizeUnits[currentLanguage] || fileSizeUnits.en;
}

// 国际化功能
function detectLanguage() {
    // 检测浏览器语言
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0];

    // 检查是否支持该语言
    if (translations[shortLang]) {
        return shortLang;
    }

    // 默认返回英语
    return 'en';
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('EdgeTTS-language', lang);

    // 更新页面语言属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

    // 应用翻译
    applyTranslations();

    // 仅中文用户显示赞赏入口（赞赏码是微信生态，境外用户无法使用）
    applyZhOnlyVisibility();

    // 更新语言切换器
    updateLanguageSwitcher();
}

// 控制仅中文场景显示的元素：顶栏赞赏入口 + 成功面板赞赏区
function applyZhOnlyVisibility() {
    const isZh = currentLanguage === 'zh';
    const tipTrigger = document.getElementById('tipTrigger');
    const tipSection = document.getElementById('tipSection');
    if (tipTrigger) tipTrigger.style.display = isZh ? '' : 'none';
    if (tipSection) tipSection.style.display = isZh ? '' : 'none';
}

function applyTranslations() {
    const langData = translations[currentLanguage];

    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            element.textContent = langData[key];
        }
    });

    // 更新 meta 标签
    document.querySelectorAll('[data-i18n-content]').forEach(element => {
        const key = element.getAttribute('data-i18n-content');
        if (langData[key]) {
            element.setAttribute('content', langData[key]);
        }
    });

    // 更新 placeholder 属性
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            element.setAttribute('placeholder', langData[key]);
        }
    });

    // 更新 title 属性
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (langData[key]) {
            element.setAttribute('title', langData[key]);
        }
    });

    // 更新 optgroup label 属性
    document.querySelectorAll('[data-i18n-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-label');
        if (langData[key]) {
            element.setAttribute('label', langData[key]);
        }
    });

    // 更新页面标题
    if (langData['page.title']) {
        document.title = langData['page.title'];
    }
}

function setButtonContent(button, icon, labelKey) {
    button.innerHTML = `<span>${icon}</span><span data-i18n="${labelKey}">${t(labelKey)}</span>`;
}

function updateLanguageSwitcher() {
    const langFlags = {
        'en': '🇺🇸',
        'zh': '🇨🇳'
    };

    const langData = translations[currentLanguage];
    document.getElementById('currentLangFlag').textContent = langFlags[currentLanguage];
    document.getElementById('currentLangName').textContent = langData['lang.current'];

    // 更新选中状态
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === currentLanguage) {
            option.classList.add('active');
        }
    });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化国际化
    initializeI18n();

    // 初始化其他功能
    initializeInputMethodTabs();
    initializeFileUpload();
    initializeModeSwitcher();
    initializeAudioUpload();
    initializeTokenConfig();
    initializeLanguageSwitcher();
    initializeRangeControls();
});

// 初始化输入方式切换
function initializeInputMethodTabs() {
    const textInputTab = document.getElementById('textInputTab');
    const fileUploadTab = document.getElementById('fileUploadTab');
    const ssmlInputTab = document.getElementById('ssmlInputTab');
    const textInputArea = document.getElementById('textInputArea');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const ssmlInputArea = document.getElementById('ssmlInputArea');
    const textArea = document.getElementById('text');

    function setActive(method) {
        currentInputMethod = method;
        [textInputTab, fileUploadTab, ssmlInputTab].forEach(function (b) {
            if (b) b.classList.remove('active');
        });
        [textInputArea, fileUploadArea, ssmlInputArea].forEach(function (a) {
            if (a) a.style.display = 'none';
        });

        if (method === 'text') {
            textInputTab.classList.add('active');
            textInputArea.style.display = 'block';
            if (textArea) textArea.required = true;
        } else if (method === 'file') {
            fileUploadTab.classList.add('active');
            fileUploadArea.style.display = 'block';
            if (textArea) textArea.required = false;
        } else if (method === 'ssml' && ssmlInputTab) {
            ssmlInputTab.classList.add('active');
            ssmlInputArea.style.display = 'block';
            if (textArea) textArea.required = false;
        }
    }

    textInputTab.addEventListener('click', function () { setActive('text'); });
    fileUploadTab.addEventListener('click', function () { setActive('file'); });
    if (ssmlInputTab) ssmlInputTab.addEventListener('click', function () { setActive('ssml'); });

    // SSML "示例"按钮：把样板写入 textarea
    const ssmlExampleBtn = document.getElementById('ssmlExampleBtn');
    if (ssmlExampleBtn) {
        ssmlExampleBtn.addEventListener('click', function () {
            const ssmlText = document.getElementById('ssmlText');
            if (!ssmlText) return;
            ssmlText.value = [
                '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="zh-CN">',
                '  <voice name="zh-CN-XiaoxiaoNeural">',
                '    <mstts:express-as style="cheerful" styledegree="2">',
                '      大家好！<break time="500ms"/>这是一段 <emphasis level="strong">SSML 示例</emphasis>。',
                '    </mstts:express-as>',
                '    <break time="300ms"/>',
                '    <prosody rate="slow" pitch="+10%">现在我用慢速、稍高的音调说话。</prosody>',
                '    电话号码：<say-as interpret-as="telephone">13800138000</say-as>。',
                '  </voice>',
                '</speak>'
            ].join('\n');
            ssmlText.focus();
        });
    }
}

// 初始化文件上传功能
function initializeFileUpload() {
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileRemoveBtn = document.getElementById('fileRemoveBtn');

    // 点击上传区域
    fileDropZone.addEventListener('click', function() {
        fileInput.click();
    });

    // 文件选择
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // 拖拽功能
    fileDropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileDropZone.classList.add('dragover');
    });

    fileDropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileDropZone.classList.remove('dragover');
    });

    fileDropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        fileDropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // 移除文件
    fileRemoveBtn.addEventListener('click', function() {
        selectedFile = null;
        fileInput.value = '';
        fileInfo.style.display = 'none';
        fileDropZone.style.display = 'block';
    });
}

// 处理文件选择
function handleFileSelect(file) {
    // 验证文件类型
    if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
        showToast(t('error.invalidFileType'), 'error');
        return;
    }

    // 验证文件大小
    if (file.size > 500 * 1024) {
        showToast(t('error.fileTooLarge'), 'error');
        return;
    }

    selectedFile = file;

    // 显示文件信息
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileInfo').style.display = 'flex';
    document.getElementById('fileDropZone').style.display = 'none';
}

// 格式化文件大小
function formatFileSize(bytes) {
    const k = 1024;
    const sizes = getFileSizeUnits();
    if (bytes === 0) return '0 ' + sizes[0];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 表单提交处理
document.getElementById('ttsForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const voice = document.getElementById('voice').value;
    const speed = document.getElementById('speed').value;
    const pitch = document.getElementById('pitch').value;
    const style = document.getElementById('style').value;

    const generateBtn = document.getElementById('generateBtn');
    const resultContainer = document.getElementById('result');
    const loading = document.getElementById('loading');
    const success = document.getElementById('success');
    const error = document.getElementById('error');

    // 验证输入
    if (currentInputMethod === 'text') {
        const text = document.getElementById('text').value;
        if (!text.trim()) {
            showToast(t('error.emptyText'), 'error');
            return;
        }
    } else if (currentInputMethod === 'file') {
        if (!selectedFile) {
            showToast(t('error.noFile'), 'error');
            return;
        }
    } else if (currentInputMethod === 'ssml') {
        const ssml = document.getElementById('ssmlText').value;
        if (!ssml.trim()) {
            showToast(t('error.emptySsml'), 'error');
            return;
        }
    }

    // 重置状态
    resultContainer.style.display = 'block';
    loading.style.display = 'block';
    success.style.display = 'none';
    error.style.display = 'none';
    generateBtn.disabled = true;
    setButtonContent(generateBtn, '🎙️', 'btn.generating');

    try {
        let response;
        let textLength = 0;

        // 更新加载提示
        const loadingText = document.getElementById('loadingText');
        const progressInfo = document.getElementById('progressInfo');

        if (currentInputMethod === 'text') {
            // 手动输入文本
            const text = document.getElementById('text').value;
            textLength = text.length;

            // 根据文本长度显示不同的提示
            if (textLength > 3000) {
                loadingText.textContent = t('loading.longText');
                progressInfo.textContent = t('loading.textLengthEstimate', {
                    count: textLength,
                    seconds: Math.ceil(textLength / 1500) * 2
                });
            } else {
                loadingText.textContent = t('loading.generating');
                progressInfo.textContent = t('loading.textLength', { count: textLength });
            }

            response = await fetch('/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: text,
                    voice: voice,
                    speed: parseFloat(speed),
                    pitch: pitch,
                    style: style
                })
            });
        } else if (currentInputMethod === 'ssml') {
            // SSML 直通模式
            const ssml = document.getElementById('ssmlText').value;
            textLength = ssml.length;
            loadingText.textContent = t('loading.generating');
            progressInfo.textContent = t('loading.textLength', { count: textLength });

            response = await fetch('/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    format: 'ssml',
                    ssml: ssml
                })
            });
        } else {
            // 文件上传
            loadingText.textContent = t('loading.fileProcessing');
            progressInfo.textContent = t('loading.fileInfo', {
                name: selectedFile.name,
                size: formatFileSize(selectedFile.size)
            });

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('voice', voice);
            formData.append('speed', speed);
            formData.append('pitch', pitch);
            formData.append('style', style);

            response = await fetch('/v1/audio/speech', {
                method: 'POST',
                body: formData
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || t('error.generateFailed'));
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // 显示音频播放器
        const audioPlayer = document.getElementById('audioPlayer');
        const downloadBtn = document.getElementById('downloadBtn');

        audioPlayer.src = audioUrl;
        downloadBtn.href = audioUrl;

        loading.style.display = 'none';
        success.style.display = 'block';

        // 显示公众号推广组件
        setTimeout(() => {
            const wechatPromotion = document.getElementById('wechatPromotion');
            wechatPromotion.style.display = 'block';
            wechatPromotion.classList.add('fade-in');
        }, 1000);

    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';

        // 根据错误类型显示不同的提示
        if (err.message.includes('Too many subrequests')) {
            error.textContent = t('error.requestTooLong');
        } else if (err.message.includes('频率限制') || err.message.includes('429')) {
            error.textContent = t('error.requestTooFrequent');
        } else if (err.message.includes('分块数量') && err.message.includes('超过限制')) {
            error.textContent = t('error.prefix') + err.message;
        } else {
            error.textContent = t('error.prefix') + err.message;
        }
    } finally {
        generateBtn.disabled = false;
        setButtonContent(generateBtn, '🎙️', 'btn.generate');
    }
});

// 初始化模式切换器
function initializeModeSwitcher() {
    const ttsMode = document.getElementById('ttsMode');
    const transcriptionMode = document.getElementById('transcriptionMode');
    const mainContent = document.querySelector('.main-content');
    const transcriptionContainer = document.getElementById('transcriptionContainer');

    ttsMode.addEventListener('click', function() {
        switchMode('tts');
    });

    transcriptionMode.addEventListener('click', function() {
        switchMode('transcription');
    });
}

// 切换功能模式
function switchMode(mode) {
    const ttsMode = document.getElementById('ttsMode');
    const transcriptionMode = document.getElementById('transcriptionMode');
    const mainContent = document.querySelector('.main-content');
    const transcriptionContainer = document.getElementById('transcriptionContainer');
    const wechatPromotion = document.getElementById('wechatPromotion');

    currentMode = mode;

    if (mode === 'tts') {
        // 切换到TTS模式
        ttsMode.classList.add('active');
        transcriptionMode.classList.remove('active');
        mainContent.style.display = 'block';
        transcriptionContainer.style.display = 'none';
    } else {
        // 切换到语音转录模式
        transcriptionMode.classList.add('active');
        ttsMode.classList.remove('active');
        mainContent.style.display = 'none';
        transcriptionContainer.style.display = 'block';
    }

    // 隐藏推广组件
    wechatPromotion.style.display = 'none';
}

// 初始化音频上传功能
function initializeAudioUpload() {
    const audioDropZone = document.getElementById('audioDropZone');
    const audioFileInput = document.getElementById('audioFileInput');
    const audioFileInfo = document.getElementById('audioFileInfo');
    const audioFileRemoveBtn = document.getElementById('audioFileRemoveBtn');

    // 点击上传区域
    audioDropZone.addEventListener('click', function() {
        audioFileInput.click();
    });

    // 文件选择
    audioFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleAudioFileSelect(file);
        }
    });

    // 拖拽功能
    audioDropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        audioDropZone.classList.add('dragover');
    });

    audioDropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        audioDropZone.classList.remove('dragover');
    });

    audioDropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        audioDropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) {
            handleAudioFileSelect(file);
        }
    });

    // 移除文件
    audioFileRemoveBtn.addEventListener('click', function() {
        selectedAudioFile = null;
        audioFileInput.value = '';
        audioFileInfo.style.display = 'none';
        audioDropZone.style.display = 'block';
    });
}

// 处理音频文件选择
function handleAudioFileSelect(file) {
    // 验证文件类型
    const allowedTypes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/flac', 'audio/aac',
        'audio/ogg', 'audio/webm', 'audio/amr', 'audio/3gpp'
    ];

    const isValidType = allowedTypes.some(type =>
        file.type.includes(type) ||
        file.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i)
    );

    if (!isValidType) {
        showToast(t('error.invalidAudioType'), 'error');
        return;
    }

    // 验证文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
        showToast(t('error.audioFileTooLarge'), 'error');
        return;
    }

    selectedAudioFile = file;

    // 显示文件信息
    document.getElementById('audioFileName').textContent = file.name;
    document.getElementById('audioFileSize').textContent = formatFileSize(file.size);
    document.getElementById('audioFileInfo').style.display = 'flex';
    document.getElementById('audioDropZone').style.display = 'none';
}

// 初始化Token配置
function initializeTokenConfig() {
    const tokenRadios = document.querySelectorAll('input[name="tokenOption"]');
    const tokenInput = document.getElementById('tokenInput');

    tokenRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'custom') {
                tokenInput.style.display = 'block';
                tokenInput.required = true;
            } else {
                tokenInput.style.display = 'none';
                tokenInput.required = false;
                tokenInput.value = '';
            }
        });
    });
}

// 处理语音转录表单提交
document.getElementById('transcriptionForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const transcribeBtn = document.getElementById('transcribeBtn');
    const transcriptionResult = document.getElementById('transcriptionResult');
    const transcriptionLoading = document.getElementById('transcriptionLoading');
    const transcriptionSuccess = document.getElementById('transcriptionSuccess');
    const transcriptionError = document.getElementById('transcriptionError');

    // 验证音频文件
    if (!selectedAudioFile) {
        showToast(t('error.noAudioFile'), 'error');
        return;
    }

    // 获取Token配置
    const tokenOption = document.querySelector('input[name="tokenOption"]:checked').value;
    const customToken = document.getElementById('tokenInput').value;

    if (tokenOption === 'custom' && !customToken.trim()) {
        showToast(t('error.customTokenRequired'), 'error');
        return;
    }

    // 重置状态
    transcriptionResult.style.display = 'block';
    transcriptionLoading.style.display = 'block';
    transcriptionSuccess.style.display = 'none';
    transcriptionError.style.display = 'none';
    transcribeBtn.disabled = true;
    setButtonContent(transcribeBtn, '🎧', 'btn.transcribing');

    // 更新加载提示
    const loadingText = document.getElementById('transcriptionLoadingText');
    const progressInfo = document.getElementById('transcriptionProgressInfo');
    loadingText.textContent = t('loading.transcribing');
    progressInfo.textContent = t('loading.fileInfo', {
        name: selectedAudioFile.name,
        size: formatFileSize(selectedAudioFile.size)
    });

    try {
        // 构建FormData
        const formData = new FormData();
        formData.append('file', selectedAudioFile);

        if (tokenOption === 'custom') {
            formData.append('token', customToken);
        }

        const response = await fetch('/v1/audio/transcriptions', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || t('error.transcribeFailed'));
        }

        const result = await response.json();

        // 显示转录结果
        document.getElementById('transcriptionText').value = result.text || '';
        transcriptionLoading.style.display = 'none';
        transcriptionSuccess.style.display = 'block';

        // 显示公众号推广组件
        setTimeout(() => {
            const wechatPromotion = document.getElementById('wechatPromotion');
            wechatPromotion.style.display = 'block';
            wechatPromotion.classList.add('fade-in');
        }, 1000);

    } catch (err) {
        transcriptionLoading.style.display = 'none';
        transcriptionError.style.display = 'block';
        transcriptionError.textContent = t('error.prefix') + err.message;
    } finally {
        transcribeBtn.disabled = false;
        setButtonContent(transcribeBtn, '🎧', 'btn.transcribe');
    }
});

// 复制转录结果
document.getElementById('copyTranscriptionBtn').addEventListener('click', async function() {
    const transcriptionText = document.getElementById('transcriptionText');
    const text = transcriptionText.value;

    try {
        await navigator.clipboard.writeText(text);
        showToast(t('btn.copied'), 'success');

        // 临时改变按钮文本
        const originalText = this.innerHTML;
        setButtonContent(this, '✅', 'btn.copied');
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        // 降级方案
        transcriptionText.select();
        document.execCommand('copy');
        showToast(t('btn.copied'), 'success');
    }
});

// 编辑转录结果
document.getElementById('editTranscriptionBtn').addEventListener('click', function() {
    const transcriptionText = document.getElementById('transcriptionText');
    const isReadonly = transcriptionText.readOnly;

    if (isReadonly) {
        transcriptionText.readOnly = false;
        transcriptionText.focus();
        setButtonContent(this, '💾', 'btn.save');
    } else {
        transcriptionText.readOnly = true;
        setButtonContent(this, '✏️', 'btn.edit');
    }
});

// 转为语音功能
document.getElementById('useForTtsBtn').addEventListener('click', function() {
    const transcriptionText = document.getElementById('transcriptionText').value;

    if (!transcriptionText.trim()) {
        showToast(t('error.emptyTranscription'), 'error');
        return;
    }

    // 切换到TTS模式
    switchMode('tts');

    // 将转录文本填入TTS文本框
    document.getElementById('text').value = transcriptionText;

    // 滚动到TTS区域
    document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
});

// 初始化国际化
function initializeI18n() {
    // 检查本地存储中的语言设置
    const savedLang = localStorage.getItem('EdgeTTS-language');

    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    } else {
        // 自动检测浏览器语言
        currentLanguage = detectLanguage();
    }

    // 应用语言设置
    setLanguage(currentLanguage);
}

// 初始化语言切换器
function initializeLanguageSwitcher() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');

    // 切换下拉菜单显示/隐藏
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });

    // 点击页面其他地方时隐藏下拉菜单
    document.addEventListener('click', function() {
        languageDropdown.classList.remove('show');
    });

    // 语言选择
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            setLanguage(selectedLang);
            languageDropdown.classList.remove('show');
        });
    });
}

// 初始化滑块控制
function initializeRangeControls() {
    const speedRange = document.getElementById('speed');
    const pitchRange = document.getElementById('pitch');
    const speedValue = document.getElementById('speedValue');
    const pitchValue = document.getElementById('pitchValue');

    // 更新语速显示
    function updateSpeedValue() {
        const value = parseFloat(speedRange.value);
        speedValue.textContent = value.toFixed(2) + 'x';

        // 更新预设按钮状态
        updatePresetButtons('speed', value);
    }

    // 更新音调显示
    function updatePitchValue() {
        const value = parseInt(pitchRange.value);
        pitchValue.textContent = (value >= 0 ? '+' : '') + value + 'Hz';

        // 更新预设按钮状态
        updatePresetButtons('pitch', value);
    }

    // 更新预设按钮的激活状态
    function updatePresetButtons(target, value) {
        const presetBtns = document.querySelectorAll(`.preset-btn[data-target="${target}"]`);
        presetBtns.forEach(btn => {
            const btnValue = parseFloat(btn.getAttribute('data-value'));
            if (Math.abs(btnValue - value) < 0.01) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 监听语速滑块变化
    speedRange.addEventListener('input', updateSpeedValue);
    speedRange.addEventListener('change', updateSpeedValue);

    // 监听音调滑块变化
    pitchRange.addEventListener('input', updatePitchValue);
    pitchRange.addEventListener('change', updatePitchValue);

    // 初始化显示
    updateSpeedValue();
    updatePitchValue();

    // 预设按钮点击事件
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const value = this.getAttribute('data-value');

            if (target === 'speed') {
                speedRange.value = value;
                updateSpeedValue();
                // 添加触觉反馈动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            } else if (target === 'pitch') {
                pitchRange.value = value;
                updatePitchValue();
                // 添加触觉反馈动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }
        });
    });
}

// ========== 主题切换和微信二维码事件 ==========
document.addEventListener('DOMContentLoaded', function() {
    // 主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 微信二维码弹窗
    const wechatBtn = document.getElementById('wechatBtn');
    const qrcodePopup = document.getElementById('qrcodePopup');

    if (wechatBtn && qrcodePopup) {
        wechatBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            qrcodePopup.classList.toggle('show');
        });

        // 点击外部关闭弹窗
        document.addEventListener('click', function(e) {
            if (!qrcodePopup.contains(e.target) && e.target !== wechatBtn) {
                qrcodePopup.classList.remove('show');
            }
        });
    }
});

// ========== 停顿语法帮助弹窗 ==========
//   - 首访自动弹一次（localStorage 记忆）
//   - textarea 旁的 ⓘ 按钮可随时唤起
//   - "不再显示" 勾选后下次不自动弹（手动按钮仍可打开）
const PAUSE_TIP_STORAGE_KEY = 'EdgeTTS-pause-tip-seen';

function openPauseModal() {
    const modal = document.getElementById('pauseModal');
    if (!modal) return;
    modal.style.display = 'flex';
    // 强制 reflow 后加 show，保证动画生效
    void modal.offsetWidth;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    // 焦点落到关闭按钮，方便键盘用户 Esc 关闭
    const closeBtn = document.getElementById('pauseModalClose');
    if (closeBtn) {
        try { closeBtn.focus({ preventScroll: true }); } catch (_) { closeBtn.focus(); }
    }
}

function closePauseModal() {
    const modal = document.getElementById('pauseModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function initializePauseHelp() {
    const helpBtn = document.getElementById('pauseHelpBtn');
    const modal = document.getElementById('pauseModal');
    const closeBtn = document.getElementById('pauseModalClose');
    const okBtn = document.getElementById('pauseModalOk');
    const backdrop = document.getElementById('pauseModalBackdrop');
    const dontShow = document.getElementById('pauseModalDontShow');

    if (!modal || !helpBtn) return;

    // 常驻按钮：永远可点开
    helpBtn.addEventListener('click', function() {
        openPauseModal();
    });

    // 关闭：× 按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', closePauseModal);
    }

    // 关闭：点遮罩
    if (backdrop) {
        backdrop.addEventListener('click', closePauseModal);
    }

    // 关闭：知道了，并按需写 localStorage
    if (okBtn) {
        okBtn.addEventListener('click', function() {
            try {
                if (dontShow && dontShow.checked) {
                    localStorage.setItem(PAUSE_TIP_STORAGE_KEY, '1');
                } else {
                    // 任何方式关闭都视为"看过一次"
                    localStorage.setItem(PAUSE_TIP_STORAGE_KEY, '1');
                }
            } catch (_) { /* localStorage 可能被禁用，忽略 */ }
            closePauseModal();
        });
    }

    // 关闭：Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closePauseModal();
        }
    });

    // 首访检查：仅当还没勾过"不再显示"时才自动弹
    let seen = false;
    try { seen = localStorage.getItem(PAUSE_TIP_STORAGE_KEY) === '1'; } catch (_) {}
    if (!seen) {
        // 稍微延迟一下，让首屏先渲染，避免对 LCP 造成干扰
        setTimeout(function() {
            // 只在 TTS 模式下首屏弹（语音转文字模式无关）
            if (typeof currentMode === 'undefined' || currentMode === 'tts') {
                openPauseModal();
            }
        }, 600);
    }
}

document.addEventListener('DOMContentLoaded', initializePauseHelp);

// ========== 赞赏功能 ==========
// 安全调用 umami（避免被广告拦截器或脚本未加载时抛错）
function trackUmami(eventName, props) {
    try {
        if (typeof window.umami !== 'undefined' && typeof window.umami.track === 'function') {
            if (props) {
                window.umami.track(eventName, props);
            } else {
                window.umami.track(eventName);
            }
        }
    } catch (_) { /* 静默失败 */ }
}

// 顶栏赞赏码弹窗：点击 ☕ 按钮切换显示
function initializeTipPopup() {
    const tipBtn = document.getElementById('tipBtn');
    const tipPopup = document.getElementById('tipPopup');
    const tipTrigger = document.getElementById('tipTrigger');
    if (!tipBtn || !tipPopup || !tipTrigger) return;

    tipBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const willShow = !tipPopup.classList.contains('show');
        tipPopup.classList.toggle('show');
        if (willShow) {
            trackUmami('tip-qr-shown', { source: 'top' });
        }
    });

    // 点外部关闭
    document.addEventListener('click', function(e) {
        if (!tipPopup.classList.contains('show')) return;
        if (!tipTrigger.contains(e.target)) {
            tipPopup.classList.remove('show');
        }
    });

    // Esc 关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && tipPopup.classList.contains('show')) {
            tipPopup.classList.remove('show');
        }
    });
}

// 监听成功面板首次出现，在赞赏区可见时埋一次曝光点（每次会话只触发一次）
function observeTipSectionExposure() {
    const tipSection = document.getElementById('tipSection');
    if (!tipSection) return;

    let exposed = false;
    const fire = function() {
        if (exposed) return;
        // 只有当面板真正显示且当前是中文时才计数
        if (currentLanguage !== 'zh') return;
        const visible = tipSection.offsetParent !== null;
        if (!visible) return;
        exposed = true;
        trackUmami('tip-promo-shown');
    };

    // 用 MutationObserver 监听父级 wechatPromotion 的 style 变化
    const promo = document.getElementById('wechatPromotion');
    if (promo && typeof MutationObserver !== 'undefined') {
        const mo = new MutationObserver(function() {
            if (promo.style.display !== 'none') {
                // 推迟到下一帧确保布局完成
                setTimeout(fire, 50);
            }
        });
        mo.observe(promo, { attributes: true, attributeFilter: ['style', 'class'] });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTipPopup();
    observeTipSectionExposure();
    // 兜底：i18n 初始化完成后再保险触发一次（防初始化顺序问题）
    setTimeout(applyZhOnlyVisibility, 0);
});
