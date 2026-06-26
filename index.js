const TOKEN_REFRESH_BEFORE_EXPIRY = 3 * 60;
let tokenInfo = {
    endpoint: null,
    token: null,
    expiredAt: null
};

// HTML 页面模板
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.title">EdgeTTS - AI-Powered Voice Processing Platform</title>
    <meta name="description" content="" data-i18n-content="page.description">
    <meta name="keywords" content="" data-i18n-content="page.keywords">
    <style>
.feature-item,.header .subtitle{color:var(--text-secondary);font-weight:500}.header,.main-content{box-shadow:var(--shadow-lg)}[data-theme=dark] body,body{background-color:var(--background-color)}.header,.loading-container,.qrcode-popup,.tip-popup,.tip-qr{text-align:center}:root{--primary-color:#2563eb;--primary-hover:#1d4ed8;--secondary-color:#64748b;--success-color:#059669;--warning-color:#d97706;--error-color:#dc2626;--background-color:#f8fafc;--surface-color:#ffffff;--text-primary:#0f172a;--text-secondary:#475569;--border-color:#e2e8f0;--border-focus:#3b82f6;--shadow-sm:0 1px 2px 0 rgb(0 0 0 / 0.05);--shadow-md:0 4px 6px -1px rgb(0 0 0 / 0.1);--shadow-lg:0 10px 15px -3px rgb(0 0 0 / 0.1);--radius-sm:6px;--radius-md:8px;--radius-lg:12px;--radius-xl:16px}.header,.main-content{background:var(--surface-color)}*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--text-primary);line-height:1.6;min-height:100vh}.container{max-width:900px;margin:0 auto;padding:20px}.header{border-radius:var(--radius-xl);padding:40px 30px;margin-bottom:30px;border:1px solid var(--border-color)}.header h1{font-size:2.5rem;font-weight:800;color:var(--primary-color);margin-bottom:12px;letter-spacing:-.025em}.header .subtitle{font-size:1.125rem;margin-bottom:20px}.form-label-row .form-label,.marker-help-section .pause-modal__examples{margin-bottom:0}.header .features{display:flex;justify-content:center;gap:30px;flex-wrap:wrap;margin-top:20px}.feature-item{display:flex;align-items:center;gap:8px;font-size:.875rem}.feature-icon{width:20px;height:20px;color:var(--success-color)}.main-content{border-radius:var(--radius-xl);border:1px solid var(--border-color);overflow:hidden}.form-container{padding:40px}.form-group{margin-bottom:24px}.form-label{display:block;margin-bottom:8px;font-weight:600;color:var(--text-primary);font-size:.875rem}.form-input,.form-select,.form-textarea{width:100%;padding:12px 16px;border:2px solid var(--border-color);border-radius:var(--radius-md);font-size:16px;color:var(--text-primary);background:var(--surface-color);transition:.2s cubic-bezier(.4, 0, .2, 1)}.btn-primary,.btn-secondary{color:#fff;cursor:pointer;align-items:center;transition:.2s cubic-bezier(.4, 0, .2, 1)}.form-input:focus,.form-select:focus,.form-textarea:focus{outline:0;border-color:var(--border-focus);box-shadow:0 0 0 3px rgb(59 130 246 / .1)}.form-textarea{min-height:120px;resize:vertical;font-family:inherit}.pause-modal__example-code,.pause-modal__examples code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}.controls-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:32px}.btn-primary{width:100%;background:var(--primary-color);border:none;padding:16px 32px;font-size:16px;font-weight:600;border-radius:var(--radius-md);display:flex;justify-content:center;gap:8px}.btn-primary:hover:not(:disabled){background:var(--primary-hover);transform:translateY(-1px);box-shadow:var(--shadow-md)}.btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}.btn-secondary{background:var(--success-color);border:none;padding:12px 24px;border-radius:var(--radius-md);text-decoration:none;display:inline-flex;gap:8px;font-weight:500}.audio-upload-zone,.file-drop-zone,.tab-btn{transition:.3s cubic-bezier(.4, 0, .2, 1);cursor:pointer;position:relative}.btn-secondary:hover{background:#047857;transform:translateY(-1px)}.result-container{margin-top:32px;padding:24px;background:var(--background-color);border-radius:var(--radius-lg);border:1px solid var(--border-color);display:none}.audio-player{width:100%;margin-bottom:16px;border-radius:var(--radius-md)}.error-message{color:var(--error-color);background:#fef2f2;border:1px solid #fecaca;padding:16px;border-radius:var(--radius-md);margin-top:16px;font-weight:500}.loading-container{padding:32px 20px}.loading-spinner{width:40px;height:40px;border:3px solid var(--border-color);border-top:3px solid var(--primary-color);border-radius:50%;animation:1s linear infinite spin;margin:0 auto 16px}.loading-text{color:var(--text-secondary);font-weight:500}.wechat-promotion{margin-top:40px;background:var(--surface-color);border-radius:var(--radius-xl);box-shadow:var(--shadow-md);border:1px solid var(--border-color);overflow:hidden}.promotion-header{background:#f1f5f9;padding:20px 30px;border-bottom:1px solid var(--border-color)}.promotion-title{font-size:1.25rem;font-weight:700;color:var(--text-primary);margin-bottom:8px}.promotion-subtitle{color:var(--text-secondary);font-size:.875rem}.promotion-content{padding:30px;display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center}.qr-code{width:120px;height:120px;border:2px solid var(--border-color);border-radius:var(--radius-lg);overflow:hidden;display:flex;align-items:center;justify-content:center}.qr-code img{width:100%;height:100%;object-fit:cover}.promotion-info h3{font-size:1.125rem;font-weight:600;color:var(--text-primary);margin-bottom:12px}.benefits-list li,.promotion-info p,.tab-btn{color:var(--text-secondary)}.promotion-info p{margin-bottom:16px;line-height:1.6}.benefits-list{list-style:none;padding:0;margin:0}.benefits-list li{display:flex;align-items:center;gap:8px;font-size:.875rem;margin-bottom:8px}.benefits-list li:before{content:"✓";color:var(--success-color);font-weight:700;font-size:1rem}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:.3s ease-out fadeIn}.input-method-tabs{display:flex;gap:4px;margin-bottom:20px;background:var(--background-color);padding:4px;border-radius:var(--radius-lg);border:1px solid var(--border-color)}.tab-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 20px;border:none;background:0 0;border-radius:var(--radius-md);font-size:.9rem;font-weight:500}.tab-btn:hover{color:var(--primary-color);background:rgba(37,99,235,.05)}.tab-btn.active{background:var(--primary-color);color:#fff;box-shadow:var(--shadow-sm);transform:translateY(-1px)}.tab-btn .tab-icon{width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(255,255,255,.1);font-size:.875rem}.tab-btn:not(.active) .tab-icon{background:rgba(100,116,139,.1)}.file-upload-container{width:100%}.audio-upload-zone,.file-drop-zone{border:2px dashed var(--border-color);border-radius:var(--radius-lg);padding:48px 24px;text-align:center;background:linear-gradient(135deg,var(--background-color) 0,rgba(248,250,252,.8) 100%);overflow:hidden}.audio-upload-zone::before,.file-drop-zone::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,rgba(37,99,235,.05) 0,rgba(99,102,241,.05) 100%);opacity:0;transition:opacity .3s}.audio-upload-zone.dragover::before,.audio-upload-zone:hover::before,.file-drop-zone.dragover::before,.file-drop-zone:hover::before{opacity:1}.audio-upload-zone.dragover,.audio-upload-zone:hover,.file-drop-zone.dragover,.file-drop-zone:hover{border-color:var(--primary-color);transform:translateY(-2px);box-shadow:0 8px 25px rgba(37,99,235,.15)}.file-drop-content{display:flex;flex-direction:column;align-items:center;gap:12px;position:relative;z-index:1}.file-drop-icon{width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--primary-color) 0,#3b82f6 100%);border-radius:var(--radius-lg);color:#fff;margin-bottom:8px;box-shadow:var(--shadow-md);position:relative}.file-drop-text{font-size:1.1rem;font-weight:600;color:var(--text-primary);margin:0;line-height:1.4}.file-drop-hint{font-size:.875rem;color:var(--text-secondary);margin:0;padding:8px 16px;background:rgba(100,116,139,.1);border-radius:var(--radius-sm)}.file-info,.language-btn{border:1px solid var(--border-color)}.file-info{display:flex;align-items:center;justify-content:space-between;padding:20px;background:linear-gradient(135deg,var(--surface-color) 0,rgba(248,250,252,.5) 100%);border-radius:var(--radius-lg);margin-top:16px;box-shadow:var(--shadow-sm);transition:.2s}.file-info:hover{transform:translateY(-1px);box-shadow:var(--shadow-md)}.file-details{display:flex;flex-direction:column;gap:6px;flex:1}.file-name{font-weight:600;color:var(--text-primary);font-size:.95rem;display:flex;align-items:center;gap:8px}.file-size,.mode-btn{color:var(--text-secondary)}.file-name::before{content:'';width:16px;height:16px;background:var(--primary-color);border-radius:3px;opacity:.8;flex-shrink:0}.file-remove-btn,.mode-btn{align-items:center;font-weight:600;transition:.3s cubic-bezier(.4, 0, .2, 1)}.file-size{font-size:.8rem;background:rgba(100,116,139,.1);padding:2px 8px;border-radius:4px;display:inline-block;width:fit-content}.file-remove-btn{width:32px;height:32px;border:none;background:var(--error-color);color:#fff;border-radius:var(--radius-md);cursor:pointer;display:flex;justify-content:center;font-size:.875rem}.language-btn,.language-dropdown,.mode-btn,.transcription-container{background:var(--surface-color)}.file-remove-btn:hover{background:#b91c1c;transform:scale(1.05);box-shadow:0 4px 12px rgba(220,38,38,.3)}.mode-btn.active,.mode-btn:hover{transform:translateY(-2px);border-color:var(--primary-color)}.mode-switcher{max-width:900px;margin:0 auto 30px;padding:0 20px;display:flex;justify-content:center;gap:20px}.mode-btn{display:flex;justify-content:center;gap:12px;padding:16px 32px;border:2px solid var(--border-color);border-radius:var(--radius-lg);font-size:1rem;cursor:pointer;position:relative;flex:1;max-width:250px}.language-btn,.language-option{padding:8px 12px;font-size:.875rem}.language-btn,.token-label{cursor:pointer;font-weight:500;color:var(--text-secondary)}.mode-icon,.token-option{align-items:center;display:flex}.mode-btn:hover{color:var(--primary-color);box-shadow:var(--shadow-lg)}.mode-btn.active{background:var(--primary-color);color:#fff;box-shadow:var(--shadow-lg)}.mode-icon{width:24px;height:24px;justify-content:center}.transcription-container{border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);border:1px solid var(--border-color);overflow:hidden;max-width:900px;margin:0 auto}.token-config{display:flex;gap:20px;margin-bottom:16px}.token-label{display:flex;align-items:center;gap:8px;transition:color .2s}.token-label:hover{color:var(--text-primary)}.token-label input[type=radio]{width:16px;height:16px;border-radius:50%;border:2px solid var(--border-color);margin:0;cursor:pointer;accent-color:var(--primary-color)}.transcription-result{margin-top:20px}.result-actions{display:flex;gap:12px;margin-top:16px;flex-wrap:wrap}.result-actions .btn-secondary{flex:1;min-width:140px}.language-btn,.top-toolbar{display:flex;align-items:center;gap:8px}.top-toolbar{position:fixed;top:20px;right:20px;z-index:1000}.language-switcher,.tip-trigger{position:relative}.language-btn{border-radius:var(--radius-md);transition:.2s;box-shadow:var(--shadow-sm)}.language-dropdown,.pause-help-btn{border:1px solid var(--border-color)}.language-btn:hover{color:var(--primary-color);border-color:var(--primary-color);box-shadow:var(--shadow-md)}.language-dropdown{position:absolute;top:100%;right:0;margin-top:4px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);min-width:120px;display:none}.form-range,.preset-btn{position:relative;cursor:pointer}.range-control,.range-labels{margin-top:8px}.language-dropdown.show,.theme-toggle .icon-moon,[data-theme=dark] .theme-toggle .icon-sun{display:block}.language-option{display:flex;align-items:center;gap:8px;cursor:pointer;color:var(--text-secondary);transition:background-color .2s}.language-option:hover{background:var(--background-color);color:var(--text-primary)}.language-option.active,[data-theme=dark] .input-method-btn.active,[data-theme=dark] .mode-tab.active{background:var(--primary-color);color:#fff}.control-value{float:right;background:linear-gradient(135deg,var(--primary-color),#3b82f6);color:#fff;padding:4px 12px;border-radius:var(--radius-sm);font-size:.75rem;font-weight:700;letter-spacing:.5px;box-shadow:0 2px 4px rgba(37,99,235,.2);animation:2s ease-in-out infinite pulse}@keyframes pulse{0%,100%{box-shadow:0 2px 4px rgba(37,99,235,.2)}50%{box-shadow:0 2px 8px rgba(37,99,235,.4)}}.range-presets{display:flex;gap:6px;margin-bottom:12px;justify-content:space-between}.preset-btn{flex:1;padding:10px 8px;border:2px solid var(--border-color);background:var(--surface-color);border-radius:var(--radius-md);font-size:1.2rem;transition:.3s cubic-bezier(.4, 0, .2, 1);overflow:hidden}.theme-toggle,.wechat-btn{transition:background .2s}.preset-btn::before{content:'';position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:rgba(37,99,235,.1);transform:translate(-50%,-50%);transition:width .4s,height .4s}.preset-btn:hover::before{width:100%;height:100%}.preset-btn:hover{border-color:var(--primary-color);transform:translateY(-2px);box-shadow:0 4px 12px rgba(37,99,235,.2)}.preset-btn.active{background:linear-gradient(135deg,var(--primary-color),#3b82f6);border-color:var(--primary-color);color:#fff;transform:scale(1.05);box-shadow:0 4px 12px rgba(37,99,235,.3)}.preset-btn.active::before,.theme-toggle .icon-sun,.tip-divider,[data-theme=dark] .theme-toggle .icon-moon{display:none}.form-range{width:100%;height:8px;border-radius:4px;background:linear-gradient(to right,#ef4444 0,#f59e0b 20%,#10b981 40%,#3b82f6 60%,#8b5cf6 80%,#ec4899 100%);outline:0;-webkit-appearance:none;appearance:none;box-shadow:inset 0 1px 3px rgba(0,0,0,.1)}.form-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--primary-color),#3b82f6);cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(37,99,235,.4),0 0 0 1px var(--border-color);transition:.2s cubic-bezier(.4, 0, .2, 1)}.form-range::-webkit-slider-thumb:hover{transform:scale(1.2);box-shadow:0 4px 12px rgba(37,99,235,.5),0 0 0 2px var(--primary-color)}.form-range::-webkit-slider-thumb:active{transform:scale(1.1);box-shadow:0 2px 6px rgba(37,99,235,.6),0 0 0 3px rgba(37,99,235,.2)}.form-range::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--primary-color),#3b82f6);cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(37,99,235,.4),0 0 0 1px var(--border-color);transition:.2s cubic-bezier(.4, 0, .2, 1)}.form-range::-moz-range-thumb:hover{transform:scale(1.2);box-shadow:0 4px 12px rgba(37,99,235,.5),0 0 0 2px var(--primary-color)}.form-range::-moz-range-thumb:active{transform:scale(1.1);box-shadow:0 2px 6px rgba(37,99,235,.6),0 0 0 3px rgba(37,99,235,.2)}.form-range::-moz-range-track{height:8px;border-radius:4px;background:linear-gradient(to right,#ef4444 0,#f59e0b 20%,#10b981 40%,#3b82f6 60%,#8b5cf6 80%,#ec4899 100%);box-shadow:inset 0 1px 3px rgba(0,0,0,.1)}.range-labels{display:flex;justify-content:space-between;font-size:.75rem;color:var(--text-secondary);font-weight:500}.range-labels span{background:var(--background-color);padding:2px 8px;border-radius:var(--radius-sm);border:1px solid var(--border-color)}.toast-container{position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;max-width:350px}.toast{padding:14px 20px;border-radius:var(--radius-md);color:#fff;font-size:.95rem;box-shadow:var(--shadow-lg);animation:.3s toastSlideIn;display:flex;align-items:center;gap:10px}.toast.success{background:linear-gradient(135deg,#059669,#10b981)}.toast.error{background:linear-gradient(135deg,#dc2626,#ef4444)}.toast.warning{background:linear-gradient(135deg,#d97706,#f59e0b)}.toast.info{background:linear-gradient(135deg,#2563eb,#3b82f6)}.toast-icon{font-size:1.2rem}@keyframes toastSlideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes toastSlideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}.wechat-qrcode{position:relative;margin-right:10px}.wechat-btn{background:0 0;border:none;cursor:pointer;padding:8px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--text-secondary)}.wechat-btn:hover{background:rgba(0,0,0,.05);color:#07c160}.wechat-btn svg{width:22px;height:22px}.qrcode-popup{position:absolute;top:100%;right:0;margin-top:8px;background:var(--surface-color);border-radius:var(--radius-lg);box-shadow:0 4px 20px rgba(0,0,0,.15);padding:16px;display:none;z-index:1000}.form-label-row,.theme-toggle{display:flex;align-items:center}.qrcode-popup.show,.tip-popup.show{display:block;animation:.2s fadeIn}.qrcode-content img{width:150px;height:150px;border-radius:var(--radius-sm)}.qrcode-content p{margin-top:10px;font-size:.9rem;color:var(--text-secondary)}[data-theme=dark]{--background-color:#0f172a;--surface-color:#1e293b;--text-primary:#f1f5f9;--text-secondary:#94a3b8;--border-color:#334155;--border-focus:#60a5fa;--shadow-sm:0 1px 2px 0 rgb(0 0 0 / 0.2);--shadow-md:0 4px 6px -1px rgb(0 0 0 / 0.3);--shadow-lg:0 10px 15px -3px rgb(0 0 0 / 0.4)}.pause-help-btn,.theme-toggle{background:0 0;cursor:pointer}[data-theme=dark] .theme-toggle:hover,[data-theme=dark] .wechat-btn:hover{background:rgba(255,255,255,.1)}[data-theme=dark] .qrcode-popup,[data-theme=dark] .tip-popup{box-shadow:0 4px 20px rgba(0,0,0,.4)}[data-theme=dark] .form-select,[data-theme=dark] .form-textarea{background-color:var(--surface-color);color:var(--text-primary);border-color:var(--border-color)}.pause-help-btn,.theme-toggle,[data-theme=dark] .mode-tab{color:var(--text-secondary)}[data-theme=dark] .file-upload-area{background:rgba(37,99,235,.1);border-color:var(--border-color)}[data-theme=dark] .file-upload-area:hover{border-color:var(--primary-color);background:rgba(37,99,235,.15)}.theme-toggle{border:none;padding:8px;border-radius:var(--radius-md);justify-content:center;margin-right:10px}.theme-toggle:hover{background:rgba(0,0,0,.05)}.theme-toggle svg{width:20px;height:20px}.form-label-row{justify-content:space-between;gap:12px;margin-bottom:6px;flex-wrap:wrap}.pause-help-btn{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:999px;font-size:.78rem;line-height:1;transition:.15s;white-space:nowrap}.pause-modal__panel,.tip-btn{border:1px solid var(--border-color)}.pause-help-btn svg{flex-shrink:0;opacity:.85}.pause-help-btn:hover{color:var(--primary-color);border-color:var(--primary-color);background:rgba(37,99,235,.08)}.pause-help-btn:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.pause-modal{position:fixed;inset:0;z-index:2000;align-items:center;justify-content:center}.pause-modal.show{display:flex!important;animation:.18s fadeIn}.pause-modal__backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55);backdrop-filter:blur(2px)}.pause-modal__panel{position:relative;width:min(600px,calc(100vw - 32px));max-height:calc(100vh - 64px);overflow-y:auto;background:var(--surface-color);color:var(--text-primary);border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);padding:28px 28px 22px;animation:.22s cubic-bezier(.2,.8,.2,1.2) pauseModalIn}@keyframes pauseModalIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}.pause-modal__close{position:absolute;top:8px;right:12px;width:32px;height:32px;background:0 0;border:none;color:var(--text-secondary);font-size:1.6rem;line-height:1;cursor:pointer;border-radius:var(--radius-sm);transition:background .15s}.pause-modal__close:hover{background:rgba(0,0,0,.06);color:var(--text-primary)}.pause-modal__header{display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-right:32px}.pause-modal__icon{font-size:1.4rem;line-height:1}.pause-modal__title{font-size:1.15rem;font-weight:700;color:var(--text-primary);margin:0}.pause-modal__intro{color:var(--text-secondary);font-size:.9rem;margin:0 0 14px;line-height:1.55}.pause-modal__examples{list-style:none;padding:0;margin:0 0 14px;display:grid;gap:8px}.pause-modal__examples li{color:var(--text-secondary);font-size:.88rem;line-height:1.5}.pause-modal__examples code{display:inline-block;padding:2px 8px;background:rgba(37,99,235,.08);color:var(--primary-color);border-radius:var(--radius-sm);font-size:.85rem;margin-right:4px}.pause-modal__example-box{background:var(--background-color);border:1px dashed var(--border-color);border-radius:var(--radius-md);padding:10px 12px;margin-bottom:14px}.pause-modal__example-label{color:var(--text-secondary);font-size:.8rem;margin-bottom:4px}.pause-modal__example-code{display:block;font-size:.85rem;color:var(--text-primary);word-break:break-all;line-height:1.5}.pause-modal__limits{font-size:.8rem;color:var(--text-secondary);margin:0 0 18px;padding:8px 12px;background:rgba(0,0,0,.025);border-left:3px solid var(--primary-color);border-radius:0 var(--radius-sm) var(--radius-sm) 0;line-height:1.5}.pause-modal__footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.pause-modal__dontshow,.tip-btn{display:inline-flex;gap:6px;cursor:pointer}.pause-modal__dontshow{align-items:center;color:var(--text-secondary);font-size:.85rem;user-select:none}.pause-modal__dontshow input[type=checkbox]{cursor:pointer;accent-color:var(--primary-color)}.pause-modal__ok{padding:8px 22px;background:var(--primary-color);color:#fff;border:none;border-radius:var(--radius-md);font-size:.9rem;font-weight:600;cursor:pointer;transition:filter .15s,transform .15s}.pause-modal__ok:hover{filter:brightness(1.08)}.marker-help-section{margin-bottom:12px}.marker-help-section__title{font-size:.92rem;font-weight:600;color:var(--text-primary);margin:0 0 6px;padding-bottom:4px;border-bottom:1px dashed var(--border-color)}.pause-modal__ok:active{transform:translateY(1px)}[data-theme=dark] .pause-help-btn:hover{background:rgba(96,165,250,.14)}[data-theme=dark] .pause-modal__backdrop{background:rgba(0,0,0,.65)}[data-theme=dark] .pause-modal__close:hover{background:rgba(255,255,255,.08)}[data-theme=dark] .pause-modal__examples code{background:rgba(96,165,250,.18);color:#93c5fd}[data-theme=dark] .pause-modal__limits{background:rgba(255,255,255,.04)}.tip-btn{align-items:center;padding:6px 12px;background:0 0;color:var(--text-secondary);border-radius:999px;font-size:.82rem;line-height:1;transition:.2s;font-family:inherit}.tip-btn-emoji{font-size:.95rem;line-height:1}.tip-btn:hover{color:#b45309;border-color:#f59e0b;background:rgba(245,158,11,.08)}.tip-btn:focus-visible{outline:#f59e0b solid 2px;outline-offset:2px}.tip-popup{position:absolute;top:100%;right:0;margin-top:8px;background:var(--surface-color);border:1px solid var(--border-color);border-radius:var(--radius-lg);box-shadow:0 4px 20px rgba(0,0,0,.15);padding:14px;display:none;z-index:1000;min-width:290px}.tip-popup-content img,.tip-qr img{height:auto;border-radius:var(--radius-sm);display:block}.tip-popup-content img{width:260px;margin:0 auto}.tip-popup-content p{margin-top:8px;font-size:.85rem;color:var(--text-secondary)}.tip-section{border-top:1px dashed var(--border-color);padding:22px 30px 26px;background:linear-gradient(135deg,rgba(245,158,11,.04),rgba(245,158,11,0))}.tip-content{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center}.tip-title{display:flex;align-items:center;gap:8px;font-size:1rem;font-weight:700;color:var(--text-primary);margin:0 0 6px}.tip-desc,.tip-qr-caption{color:var(--text-secondary)}.tip-emoji{font-size:1.15rem}.tip-desc{font-size:.85rem;margin:0;line-height:1.55}.tip-qr{flex-shrink:0}.tip-qr img{width:220px;border:1px solid var(--border-color);background:#fff;padding:4px}.tip-qr-caption{margin:6px 0 0;font-size:.75rem}[data-theme=dark] .tip-btn:hover{color:#fbbf24;border-color:#f59e0b;background:rgba(245,158,11,.14)}[data-theme=dark] .tip-section{background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(245,158,11,0))}@media (prefers-color-scheme:dark){:root{--background-color:#0f172a;--surface-color:#1e293b;--text-primary:#f1f5f9;--text-secondary:#94a3b8;--border-color:#334155;--border-focus:#60a5fa;--shadow-sm:0 1px 2px 0 rgb(0 0 0 / 0.2);--shadow-md:0 4px 6px -1px rgb(0 0 0 / 0.3);--shadow-lg:0 10px 15px -3px rgb(0 0 0 / 0.4)}body{background-color:var(--background-color)}.wechat-btn:hover{background:rgba(255,255,255,.1)}.qrcode-popup{box-shadow:0 4px 20px rgba(0,0,0,.4)}.form-select,.form-textarea{background-color:var(--surface-color);color:var(--text-primary);border-color:var(--border-color)}.form-select:focus,.form-textarea:focus{border-color:var(--border-focus)}.mode-tab{color:var(--text-secondary)}.input-method-btn.active,.mode-tab.active{background:var(--primary-color);color:#fff}.file-upload-area{background:rgba(37,99,235,.1);border-color:var(--border-color)}.file-upload-area:hover{border-color:var(--primary-color);background:rgba(37,99,235,.15)}:root:not([data-theme=light]) .pause-help-btn:hover{background:rgba(96,165,250,.14)}:root:not([data-theme=light]) .pause-modal__backdrop{background:rgba(0,0,0,.65)}:root:not([data-theme=light]) .pause-modal__close:hover{background:rgba(255,255,255,.08)}:root:not([data-theme=light]) .pause-modal__examples code{background:rgba(96,165,250,.18);color:#93c5fd}:root:not([data-theme=light]) .pause-modal__limits{background:rgba(255,255,255,.04)}:root:not([data-theme=light]) .tip-btn:hover{color:#fbbf24;border-color:#f59e0b;background:rgba(245,158,11,.14)}:root:not([data-theme=light]) .tip-section{background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(245,158,11,0))}}@media (max-width:768px){.container{padding:16px}.header{padding:30px 20px}.header h1{font-size:2rem}.form-container{padding:24px}.controls-grid{grid-template-columns:1fr;gap:16px}.promotion-content{grid-template-columns:1fr;text-align:center;gap:20px}.qr-code,.tip-qr{margin:0 auto}.input-method-tabs{gap:2px;padding:2px}.tab-btn{padding:12px 16px;font-size:.85rem;gap:8px}.tab-btn .tab-icon{width:18px;height:18px}.audio-upload-zone,.file-drop-zone{padding:32px 16px}.file-drop-icon{width:56px;height:56px}.file-info{padding:16px;flex-direction:column;gap:12px;align-items:flex-start}.file-remove-btn{align-self:flex-end}.mode-switcher{padding:0 16px;margin-bottom:20px;flex-direction:column;gap:12px}.mode-btn{max-width:none;padding:14px 20px;font-size:.9rem;gap:8px}.mode-icon{width:20px;height:20px}.token-config{flex-direction:column;gap:12px}.result-actions{flex-direction:column}.result-actions .btn-secondary{min-width:auto}.range-presets{gap:4px}.preset-btn{padding:8px 6px;font-size:1rem}.control-value,.range-labels{font-size:.7rem}.control-value{padding:3px 10px}.form-range::-webkit-slider-thumb{width:20px;height:20px}.form-range::-moz-range-thumb{width:20px;height:20px}.range-labels span{padding:1px 6px}.tip-btn-text{display:none}.tip-btn{padding:6px 10px}.tip-content{grid-template-columns:1fr;text-align:center}.tip-section{padding:18px 20px 22px}.tip-popup{right:-8px}}@media (max-width:480px){.toast-container{left:10px;right:10px;max-width:none}.pause-modal__panel{padding:22px 18px 18px;border-radius:var(--radius-lg)}.pause-modal__title{font-size:1.05rem}.pause-modal__footer{flex-direction:column-reverse;align-items:stretch}.pause-modal__ok{width:100%}.tip-popup{right:0;left:auto;max-width:calc(100vw - 32px)}.tip-popup-content img{width:220px}}
    </style>
</head>
<body>
    <!-- 主题切换按钮 -->
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <svg class="icon-moon" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg class="icon-sun" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
    </button>
    <!-- 语言切换器 -->
    <div class="language-switcher">
        <div class="language-btn" id="languageBtn">
            <span id="currentLangFlag">🌐</span>
            <span id="currentLangName" data-i18n="lang.current">English</span>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>
        <div class="language-dropdown" id="languageDropdown">
            <div class="language-option" data-lang="en">
                <span>🇺🇸</span>
                <span data-i18n="lang.en">English</span>
            </div>
            <div class="language-option" data-lang="zh">
                <span>🇨🇳</span>
                <span data-i18n="lang.zh">中文</span>
            </div>
            <div class="language-option" data-lang="ja">
                <span>🇯🇵</span>
                <span data-i18n="lang.ja">日本語</span>
            </div>
            <div class="language-option" data-lang="ko">
                <span>🇰🇷</span>
                <span data-i18n="lang.ko">한국어</span>
            </div>
            <div class="language-option" data-lang="es">
                <span>🇪🇸</span>
                <span data-i18n="lang.es">Español</span>
            </div>
            <div class="language-option" data-lang="fr">
                <span>🇫🇷</span>
                <span data-i18n="lang.fr">Français</span>
            </div>
            <div class="language-option" data-lang="de">
                <span>🇩🇪</span>
                <span data-i18n="lang.de">Deutsch</span>
            </div>
            <div class="language-option" data-lang="ru">
                <span>🇷🇺</span>
                <span data-i18n="lang.ru">Русский</span>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="header">
            <h1 data-i18n="header.title">EdgeTTS</h1>
            <p class="subtitle" data-i18n="header.subtitle">AI-Powered Voice Processing Platform</p>
            <div class="features">
                <div class="feature-item">
                    <span class="feature-icon">✨</span>
                    <span data-i18n="header.feature1">20+ Voice Options</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <span data-i18n="header.feature2">Lightning Fast</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🆓</span>
                    <span data-i18n="header.feature3">Completely Free</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span data-i18n="header.feature4">Download Support</span>
                </div>
            </div>
        </div>
        
        <!-- 主功能切换器 -->
        <div class="mode-switcher">
            <button type="button" class="mode-btn active" id="ttsMode">
                <span class="mode-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                </span>
                <span data-i18n="mode.tts">Text to Speech</span>
            </button>
            <button type="button" class="mode-btn" id="transcriptionMode">
                <span class="mode-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 9m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                        <path d="M9 17v4"/>
                        <path d="M12 13a3 3 0 0 0 3 -3"/>
                        <path d="M15 9.5v-3a3 3 0 0 0 -3 -3h-1"/>
                        <path d="M19 8v8"/>
                        <path d="M17 9v6"/>
                        <path d="M21 9v6"/>
                    </svg>
                </span>
                <span data-i18n="mode.transcription">Speech to Text</span>
            </button>
        </div>
        
        <div class="main-content">
            <div class="form-container">
                <form id="ttsForm">
                    <!-- 输入方式选择 -->
                    <div class="form-group">
                        <label class="form-label">选择输入方式</label>
                        <div class="input-method-tabs">
                            <button type="button" class="tab-btn active" id="textInputTab">
                                <span class="tab-icon">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                </span>
                                <span>手动输入</span>
                            </button>
                            <button type="button" class="tab-btn" id="fileUploadTab">
                                <span class="tab-icon">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                </span>
                                <span>上传文件</span>
                            </button>
                             <button type="button" class="tab-btn" id="ssmlInputTab">
                                <span class="tab-icon">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.6 16.6 19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4zm-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"/>
                                    </svg>
                                </span>
                                <span data-i18n="input.ssml">SSML</span>
                            </button>
                        </div>
                        
                    </div>

                    <!-- 手动输入区域 -->
                    <div class="form-group" id="textInputArea">
                        <label class="form-label" for="text">输入文本</label>
                        <textarea class="form-textarea" id="text" placeholder="请输入要转换为语音的文本内容，支持中文、英文、数字等..." required></textarea>
                    </div>

                    <!-- 文件上传区域 -->
                    <div class="form-group" id="fileUploadArea" style="display: none;">
                        <label class="form-label" for="fileInput">上传txt文件</label>
                        <div class="file-upload-container">
                            <div class="file-drop-zone" id="fileDropZone">
                                <div class="file-drop-content">
                                    <div class="file-drop-icon">
                                        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 5L13.09 6.26L12 0L10.91 6.26L5 5L6.26 10.91L0 12L6.26 13.09L5 19L10.91 17.74L12 24L13.09 17.74L19 19L17.74 13.09L24 12Z"/>
                                            <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
                                        </svg>
                                    </div>
                                    <p class="file-drop-text">拖拽txt文件到此处，或点击选择文件</p>
                                    <p class="file-drop-hint">支持txt格式，最大500KB</p>
                                </div>
                                <input type="file" id="fileInput" accept=".txt,text/plain" style="display: none;">
                            </div>
                            <div class="file-info" id="fileInfo" style="display: none;">
                                <div class="file-details">
                                    <span class="file-name" id="fileName"></span>
                                    <span class="file-size" id="fileSize"></span>
                                </div>
                                <button type="button" class="file-remove-btn" id="fileRemoveBtn">✕</button>
                            </div>
                        </div>
                    </div>
                    <!-- SSML 直通输入区域 -->
                    <div class="form-group" id="ssmlInputArea" style="display: none;">
                        <div class="form-label-row">
                            <label class="form-label" for="ssmlText" data-i18n="ssml.label">SSML Markup</label>
                            <button type="button" class="pause-help-btn" id="ssmlExampleBtn" data-i18n-title="ssml.exampleTitle" title="Insert an SSML example">
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                                </svg>
                                <span data-i18n="ssml.exampleBtn">Example</span>
                            </button>
                        </div>
                        <textarea class="form-textarea" id="ssmlText"
                                  data-i18n-placeholder="ssml.placeholder"
                                  placeholder='<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">&#10;  <voice name="zh-CN-XiaoxiaoNeural">大家好<break time="500ms"/>欢迎使用 SSML</voice>&#10;</speak>'
                                  spellcheck="false"
                                  style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; min-height: 180px;"></textarea>
                        <p class="file-drop-hint" data-i18n="ssml.hint" style="margin-top: 6px;">SSML mode passes raw markup directly to Microsoft TTS. Voice/speed/pitch/style controls below are ignored. Max 8KB.</p>
                    </div>
                    <div class="controls-grid">
                        <div class="form-group">
                            <label class="form-label" for="voice">语音选择</label>
                            <select class="form-select" id="voice">
                                <!-- 中文语音 Chinese -->
                                <optgroup label="Chinese" data-i18n-label="voice.group.chinese">
                                    <option value="zh-CN-XiaoxiaoNeural">晓晓 Xiaoxiao (女声·温柔)</option>
                                    <option value="zh-CN-YunxiNeural">云希 Yunxi (男声·清朗)</option>
                                    <option value="zh-CN-YunyangNeural">云扬 Yunyang (男声·阳光)</option>
                                    <option value="zh-CN-XiaoyiNeural">晓伊 Xiaoyi (女声·甜美)</option>
                                    <option value="zh-CN-YunjianNeural">云健 Yunjian (男声·稳重)</option>
                                    <option value="zh-CN-XiaochenNeural">晓辰 Xiaochen (女声·知性)</option>
                                    <option value="zh-CN-XiaohanNeural">晓涵 Xiaohan (女声·优雅)</option>
                                    <option value="zh-CN-XiaomengNeural">晓梦 Xiaomeng (女声·梦幻)</option>
                                    <option value="zh-CN-XiaomoNeural">晓墨 Xiaomo (女声·文艺)</option>
                                    <option value="zh-CN-XiaoqiuNeural">晓秋 Xiaoqiu (女声·成熟)</option>
                                    <option value="zh-CN-XiaoruiNeural">晓睿 Xiaorui (女声·智慧)</option>
                                    <option value="zh-CN-XiaoshuangNeural">晓双 Xiaoshuang (女声·活泼)</option>
                                    <option value="zh-CN-XiaoxuanNeural">晓萱 Xiaoxuan (女声·清新)</option>
                                    <option value="zh-CN-XiaoyanNeural">晓颜 Xiaoyan (女声·柔美)</option>
                                    <option value="zh-CN-XiaoyouNeural">晓悠 Xiaoyou (女声·悠扬)</option>
                                    <option value="zh-CN-XiaozhenNeural">晓甄 Xiaozhen (女声·端庄)</option>
                                    <option value="zh-CN-YunfengNeural">云枫 Yunfeng (男声·磁性)</option>
                                    <option value="zh-CN-YunhaoNeural">云皓 Yunhao (男声·豪迈)</option>
                                    <option value="zh-CN-YunxiaNeural">云夏 Yunxia (男声·热情)</option>
                                    <option value="zh-CN-YunyeNeural">云野 Yunye (男声·野性)</option>
                                    <option value="zh-CN-YunzeNeural">云泽 Yunze (男声·深沉)</option>
                                </optgroup>
                                <!-- 英语语音 English -->
                                <optgroup label="English" data-i18n-label="voice.group.english">
                                    <option value="en-US-JennyNeural">Jenny (Female, US)</option>
                                    <option value="en-US-GuyNeural">Guy (Male, US)</option>
                                    <option value="en-US-AriaNeural">Aria (Female, US)</option>
                                    <option value="en-US-DavisNeural">Davis (Male, US)</option>
                                    <option value="en-US-AmberNeural">Amber (Female, US)</option>
                                    <option value="en-US-AnaNeural">Ana (Female, Child, US)</option>
                                    <option value="en-US-AndrewNeural">Andrew (Male, US)</option>
                                    <option value="en-US-AshleyNeural">Ashley (Female, US)</option>
                                    <option value="en-US-BrandonNeural">Brandon (Male, US)</option>
                                    <option value="en-US-ChristopherNeural">Christopher (Male, US)</option>
                                    <option value="en-US-CoraNeural">Cora (Female, US)</option>
                                    <option value="en-US-ElizabethNeural">Elizabeth (Female, US)</option>
                                    <option value="en-US-EricNeural">Eric (Male, US)</option>
                                    <option value="en-US-JacobNeural">Jacob (Male, US)</option>
                                    <option value="en-US-JaneNeural">Jane (Female, US)</option>
                                    <option value="en-US-JasonNeural">Jason (Male, US)</option>
                                    <option value="en-US-MichelleNeural">Michelle (Female, US)</option>
                                    <option value="en-US-MonicaNeural">Monica (Female, US)</option>
                                    <option value="en-US-NancyNeural">Nancy (Female, US)</option>
                                    <option value="en-US-RogerNeural">Roger (Male, US)</option>
                                    <option value="en-US-SaraNeural">Sara (Female, US)</option>
                                    <option value="en-US-SteffanNeural">Steffan (Male, US)</option>
                                    <option value="en-US-TonyNeural">Tony (Male, US)</option>
                                    <option value="en-GB-SoniaNeural">Sonia (Female, UK)</option>
                                    <option value="en-GB-RyanNeural">Ryan (Male, UK)</option>
                                    <option value="en-GB-LibbyNeural">Libby (Female, UK)</option>
                                    <option value="en-GB-MaisieNeural">Maisie (Female, Child, UK)</option>
                                    <option value="en-AU-NatashaNeural">Natasha (Female, AU)</option>
                                    <option value="en-AU-WilliamNeural">William (Male, AU)</option>
                                </optgroup>
                                <!-- 日语语音 Japanese -->
                                <optgroup label="Japanese" data-i18n-label="voice.group.japanese">
                                    <option value="ja-JP-NanamiNeural">Nanami 七海 (女性)</option>
                                    <option value="ja-JP-KeitaNeural">Keita 圭太 (男性)</option>
                                    <option value="ja-JP-AoiNeural">Aoi 葵 (女性)</option>
                                    <option value="ja-JP-DaichiNeural">Daichi 大地 (男性)</option>
                                    <option value="ja-JP-MayuNeural">Mayu 真由 (女性)</option>
                                    <option value="ja-JP-NaokiNeural">Naoki 直樹 (男性)</option>
                                    <option value="ja-JP-ShioriNeural">Shiori 栞 (女性)</option>
                                </optgroup>
                                <!-- 韩语语音 Korean -->
                                <optgroup label="Korean" data-i18n-label="voice.group.korean">
                                    <option value="ko-KR-SunHiNeural">SunHi 선희 (여성)</option>
                                    <option value="ko-KR-InJoonNeural">InJoon 인준 (남성)</option>
                                    <option value="ko-KR-BongJinNeural">BongJin 봉진 (남성)</option>
                                    <option value="ko-KR-GookMinNeural">GookMin 국민 (남성)</option>
                                    <option value="ko-KR-JiMinNeural">JiMin 지민 (여성)</option>
                                    <option value="ko-KR-SeoHyeonNeural">SeoHyeon 서현 (여성)</option>
                                    <option value="ko-KR-SoonBokNeural">SoonBok 순복 (여성)</option>
                                    <option value="ko-KR-YuJinNeural">YuJin 유진 (여성)</option>
                                </optgroup>
                                <!-- 法语语音 French -->
                                <optgroup label="French" data-i18n-label="voice.group.french">
                                    <option value="fr-FR-DeniseNeural">Denise (Femme)</option>
                                    <option value="fr-FR-HenriNeural">Henri (Homme)</option>
                                    <option value="fr-FR-EloiseNeural">Eloise (Femme)</option>
                                    <option value="fr-FR-AlainNeural">Alain (Homme)</option>
                                    <option value="fr-FR-BrigitteNeural">Brigitte (Femme)</option>
                                    <option value="fr-FR-CelesteNeural">Celeste (Femme)</option>
                                    <option value="fr-FR-ClaudeNeural">Claude (Homme)</option>
                                    <option value="fr-FR-CoraliNeural">Corali (Femme)</option>
                                    <option value="fr-FR-JacquelineNeural">Jacqueline (Femme)</option>
                                    <option value="fr-FR-JeromeNeural">Jerome (Homme)</option>
                                    <option value="fr-FR-JosephineNeural">Josephine (Femme)</option>
                                    <option value="fr-FR-MauriceNeural">Maurice (Homme)</option>
                                    <option value="fr-FR-YvesNeural">Yves (Homme)</option>
                                    <option value="fr-FR-YvetteNeural">Yvette (Femme)</option>
                                </optgroup>
                                <!-- 德语语音 German -->
                                <optgroup label="German" data-i18n-label="voice.group.german">
                                    <option value="de-DE-KatjaNeural">Katja (Frau)</option>
                                    <option value="de-DE-ConradNeural">Conrad (Mann)</option>
                                    <option value="de-DE-AmalaNeural">Amala (Frau)</option>
                                    <option value="de-DE-BerndNeural">Bernd (Mann)</option>
                                    <option value="de-DE-ChristophNeural">Christoph (Mann)</option>
                                    <option value="de-DE-ElkeNeural">Elke (Frau)</option>
                                    <option value="de-DE-GiselaNeural">Gisela (Frau)</option>
                                    <option value="de-DE-KasperNeural">Kasper (Mann)</option>
                                    <option value="de-DE-KillianNeural">Killian (Mann)</option>
                                    <option value="de-DE-KlarissaNeural">Klarissa (Frau)</option>
                                    <option value="de-DE-KlausNeural">Klaus (Mann)</option>
                                    <option value="de-DE-LouisaNeural">Louisa (Frau)</option>
                                    <option value="de-DE-MajaNeural">Maja (Frau)</option>
                                    <option value="de-DE-RalfNeural">Ralf (Mann)</option>
                                    <option value="de-DE-TanjaNeural">Tanja (Frau)</option>
                                </optgroup>
                                <!-- 西班牙语语音 Spanish -->
                                <optgroup label="Spanish" data-i18n-label="voice.group.spanish">
                                    <option value="es-ES-ElviraNeural">Elvira (Mujer)</option>
                                    <option value="es-ES-AlvaroNeural">Alvaro (Hombre)</option>
                                    <option value="es-ES-AbrilNeural">Abril (Mujer)</option>
                                    <option value="es-ES-ArnauNeural">Arnau (Hombre)</option>
                                    <option value="es-ES-DarioNeural">Dario (Hombre)</option>
                                    <option value="es-ES-EliasNeural">Elias (Hombre)</option>
                                    <option value="es-ES-EstrellaNeural">Estrella (Mujer)</option>
                                    <option value="es-ES-IreneNeural">Irene (Mujer)</option>
                                    <option value="es-ES-LaiaNeural">Laia (Mujer)</option>
                                    <option value="es-ES-LiaNeural">Lia (Mujer)</option>
                                    <option value="es-ES-NilNeural">Nil (Hombre)</option>
                                    <option value="es-ES-SaulNeural">Saul (Hombre)</option>
                                    <option value="es-ES-TeoNeural">Teo (Hombre)</option>
                                    <option value="es-ES-TrianaNeural">Triana (Mujer)</option>
                                    <option value="es-ES-VeraNeural">Vera (Mujer)</option>
                                    <option value="es-MX-DaliaNeural">Dalia (Mujer, MX)</option>
                                    <option value="es-MX-JorgeNeural">Jorge (Hombre, MX)</option>
                                </optgroup>
                                <!-- 俄语语音 Russian -->
                                <optgroup label="Russian" data-i18n-label="voice.group.russian">
                                    <option value="ru-RU-SvetlanaNeural">Svetlana Светлана (Женский)</option>
                                    <option value="ru-RU-DmitryNeural">Dmitry Дмитрий (Мужской)</option>
                                    <option value="ru-RU-DariyaNeural">Dariya Дарья (Женский)</option>
                                </optgroup>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="speed">
                                <span data-i18n="speed.label">Speed Adjustment</span>
                                <span class="control-value" id="speedValue">1.00x</span>
                            </label>
                            <div class="range-control">
                                <div class="range-presets">
                                    <button type="button" class="preset-btn" data-target="speed" data-value="0.5" data-i18n-title="speed.verySlow" title="Very Slow">🐌</button>
                                    <button type="button" class="preset-btn" data-target="speed" data-value="0.75" data-i18n-title="speed.slow" title="Slow">🚶</button>
                                    <button type="button" class="preset-btn active" data-target="speed" data-value="1.0" data-i18n-title="speed.normal" title="Normal">⚡</button>
                                    <button type="button" class="preset-btn" data-target="speed" data-value="1.5" data-i18n-title="speed.fast" title="Fast">🚀</button>
                                    <button type="button" class="preset-btn" data-target="speed" data-value="2.0" data-i18n-title="speed.veryFast" title="Very Fast">💨</button>
                                </div>
                                <input type="range" class="form-range" id="speed"
                                       min="0.25" max="3.0" step="0.05" value="1.0">
                                <div class="range-labels">
                                    <span>0.25x</span>
                                    <span>1.0x</span>
                                    <span>3.0x</span>
                                </div>
                            </div>
                        </div>

                        
                       <div class="form-group">
                            <label class="form-label" for="pitch">
                                <span data-i18n="pitch.label">Pitch Adjustment</span>
                                <span class="control-value" id="pitchValue">0Hz</span>
                            </label>
                            <div class="range-control">
                                <div class="range-presets">
                                    <button type="button" class="preset-btn" data-target="pitch" data-value="-50" data-i18n-title="pitch.veryLow" title="Very Low">📉</button>
                                    <button type="button" class="preset-btn" data-target="pitch" data-value="-25" data-i18n-title="pitch.low" title="Low">📊</button>
                                    <button type="button" class="preset-btn active" data-target="pitch" data-value="0" data-i18n-title="pitch.normal" title="Normal">🎵</button>
                                    <button type="button" class="preset-btn" data-target="pitch" data-value="25" data-i18n-title="pitch.high" title="High">📈</button>
                                    <button type="button" class="preset-btn" data-target="pitch" data-value="50" data-i18n-title="pitch.veryHigh" title="Very High">🎶</button>
                                </div>
                                <input type="range" class="form-range" id="pitch"
                                       min="-50" max="50" step="1" value="0">
                                <div class="range-labels">
                                    <span>-50Hz</span>
                                    <span>0Hz</span>
                                    <span>+50Hz</span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="style" data-i18n="style.label">Voice Style</label>
                            <select class="form-select" id="style">
                                <option value="general" selected data-i18n="style.general">🎭 General</option>
                                <option value="assistant" data-i18n="style.assistant">🤖 Assistant</option>
                                <option value="chat" data-i18n="style.chat">💬 Chat</option>
                                <option value="customerservice" data-i18n="style.customerservice">📞 Customer Service</option>
                                <option value="newscast" data-i18n="style.newscast">📺 Newscast</option>
                                <option value="affectionate" data-i18n="style.affectionate">💕 Affectionate</option>
                                <option value="calm" data-i18n="style.calm">😌 Calm</option>
                                <option value="cheerful" data-i18n="style.cheerful">😊 Cheerful</option>
                                <option value="gentle" data-i18n="style.gentle">🌸 Gentle</option>
                                <option value="lyrical" data-i18n="style.lyrical">🎼 Lyrical</option>
                                <option value="serious" data-i18n="style.serious">🎯 Serious</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" id="generateBtn">
                        <span>🎙️</span>
                        <span data-i18n="btn.generate">Generate Voice</span>
                    </button>
            </form>
            
                <div id="result" class="result-container">
                    <div id="loading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                         <p class="loading-text" id="loadingText" data-i18n="loading.generating">Generating voice, please wait...</p>
                        <div class="progress-info" id="progressInfo" style="margin-top: 12px; font-size: 0.875rem; color: var(--text-secondary);"></div>
                    </div>
                    
                    <div id="success" style="display: none;">
                        <audio id="audioPlayer" class="audio-player" controls></audio>
                        <a id="downloadBtn" class="btn-secondary" download="speech.mp3">
                            <span>📥</span>
                            <span data-i18n="btn.download">Download Audio</span>
                        </a>
                    </div>
                    
                    <div id="error" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>
        
        <!-- 语音转录界面 -->
        <div class="transcription-container" id="transcriptionContainer" style="display: none;">
            <div class="form-container">
                <form id="transcriptionForm">
                    <div class="form-group">
                        <label class="form-label">上传音频文件</label>
                        <div class="audio-upload-zone" id="audioDropZone">
                            <div class="file-drop-content">
                                <div class="file-drop-icon">
                                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                        <path d="M14 2v6h6"/>
                                        <path d="M12 18v-6"/>
                                        <path d="M9 15l3-3 3 3"/>
                                    </svg>
                                </div>
                                <p class="file-drop-text">拖拽音频文件到此处，或点击选择文件</p>
                                <p class="file-drop-hint">支持mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp格式，最大10MB</p>
                            </div>
                            <input type="file" id="audioFileInput" accept=".mp3,.wav,.m4a,.flac,.aac,.ogg,.webm,.amr,.3gp,audio/*" style="display: none;">
                        </div>
                        <div class="file-info" id="audioFileInfo" style="display: none;">
                            <div class="file-details">
                                <span class="file-name" id="audioFileName"></span>
                                <span class="file-size" id="audioFileSize"></span>
                            </div>
                            <button type="button" class="file-remove-btn" id="audioFileRemoveBtn">✕</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="tokenInput">API Token配置</label>
                        <div class="token-config">
                            <div class="token-option">
                                <label class="token-label">
                                    <input type="radio" name="tokenOption" value="default" checked>
                                    <span>使用默认Token</span>
                                </label>
                            </div>
                            <div class="token-option">
                                <label class="token-label">
                                    <input type="radio" name="tokenOption" value="custom">
                                    <span>使用硅基流动自定义Token</span>
                                </label>
                            </div>
                        </div>
                        <input type="password" class="form-input" id="tokenInput" 
                               placeholder="输入您的API Token（可选）" style="display: none;">
                    </div>

                    <button type="submit" class="btn-primary" id="transcribeBtn">
                        <span>🎧</span>
                        <span>开始语音转录</span>
                    </button>
                </form>

                <div id="transcriptionResult" class="result-container">
                    <div id="transcriptionLoading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text" id="transcriptionLoadingText">正在转录音频，请稍候...</p>
                        <div class="progress-info" id="transcriptionProgressInfo" style="margin-top: 12px; font-size: 0.875rem; color: var(--text-secondary);"></div>
                    </div>
                    
                    <div id="transcriptionSuccess" style="display: none;">
                        <div class="transcription-result">
                            <label class="form-label">转录结果</label>
                            <textarea class="form-textarea" id="transcriptionText" 
                                      placeholder="转录结果将在这里显示..." readonly></textarea>
                            <div class="result-actions">
                                <button type="button" class="btn-secondary" id="copyTranscriptionBtn">
                                    <span>📋</span>
                                    <span>复制文本</span>
                                </button>
                                <button type="button" class="btn-secondary" id="editTranscriptionBtn">
                                    <span>✏️</span>
                                    <span>编辑文本</span>
                                </button>
                                <button type="button" class="btn-secondary" id="useForTtsBtn">
                                    <span>🎙️</span>
                                    <span>转为语音</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="transcriptionError" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>
        
        <!-- 公众号推广组件 -->
        <div class="wechat-promotion" id="wechatPromotion" style="display: none;">
            <div class="promotion-header">
               
            </div>
            <div class="promotion-content">
              
                <div class="promotion-info">
                  
                
                </div>
            </div>
        </div>
    </div>
    <!-- 语音指令帮助弹窗：首访自动弹一次 + 顶部 ⓘ 按钮可随时唤起 -->
    <div class="pause-modal" id="pauseModal" role="dialog" aria-modal="true" aria-labelledby="pauseModalTitle" style="display: none;">
        <div class="pause-modal__backdrop" id="pauseModalBackdrop"></div>
        <div class="pause-modal__panel">
            <button type="button" class="pause-modal__close" id="pauseModalClose" aria-label="Close">×</button>

            <div class="pause-modal__header">
                <span class="pause-modal__icon">🎙️</span>
                <h2 class="pause-modal__title" id="pauseModalTitle" data-i18n="marker.modalTitle">在文本中插入语音指令</h2>
            </div>

            <p class="pause-modal__intro" data-i18n="marker.modalIntro">在文本中插入下面这些标记，可以精确控制停顿、重音、语速、音调、情感、朗读方式等。语法整体风格：<code>[名字:值]内容[/名字]</code>，pause 是自闭合的。</p>

            <div class="marker-help-section">
                <h3 class="marker-help-section__title" data-i18n="marker.section.pause">⏸ 停顿（自闭合）</h3>
                <ul class="pause-modal__examples">
                    <li><code>[pause:500ms]</code> — <span data-i18n="marker.pause.ms">精确毫秒（最大 5000ms）</span></li>
                    <li><code>[pause:1.5s]</code> — <span data-i18n="marker.pause.sec">秒，支持小数</span></li>
                    <li><code>[pause:weak]</code> / <code>[pause:medium]</code> / <code>[pause:strong]</code> — <span data-i18n="marker.pause.strength">按强度（x-weak ~ x-strong）</span></li>
                    <li><code>[pause]</code> — <span data-i18n="marker.pause.default">默认中等停顿</span></li>
                </ul>
            </div>

            <div class="marker-help-section">
                <h3 class="marker-help-section__title" data-i18n="marker.section.emphasis">💪 重音 emphasis</h3>
                <ul class="pause-modal__examples">
                    <li><code>[emphasis:strong]非常重要[/emphasis]</code> — <span data-i18n="marker.emphasis.levels">level: reduced / moderate / strong / x-strong</span></li>
                </ul>
            </div>

            <div class="marker-help-section">
                <h3 class="marker-help-section__title" data-i18n="marker.section.prosody">🎚 语速 / 音调 / 音量</h3>
                <ul class="pause-modal__examples">
                    <li><code>[rate:slow]慢一些[/rate]</code> — <span data-i18n="marker.rate">x-slow / slow / medium / fast / x-fast 或 ±N% (如 +50%)</span></li>
                    <li><code>[pitch:+10%]高一些[/pitch]</code> — <span data-i18n="marker.pitch">high / low 或 ±NHz / ±N% / ±Nst（半音）</span></li>
                    <li><code>[volume:loud]大声[/volume]</code> — <span data-i18n="marker.volume">silent / soft / loud / x-loud 或 ±NdB</span></li>
                </ul>
            </div>

            <div class="marker-help-section">
                <h3 class="marker-help-section__title" data-i18n="marker.section.style">🎭 情感风格 style（仅部分中文 voice 支持）</h3>
                <ul class="pause-modal__examples">
                    <li><code>[style:cheerful]开心地说[/style]</code> — <span data-i18n="marker.style.basic">cheerful / sad / angry / calm / serious / chat / customerservice ...</span></li>
                    <li><code>[style:cheerful:1.5]很开心[/style]</code> — <span data-i18n="marker.style.degree">可选强度 0.01 ~ 2.0</span></li>
                </ul>
            </div>

            <div class="marker-help-section">
                <h3 class="marker-help-section__title" data-i18n="marker.section.sayas">🔢 朗读方式 say-as</h3>
                <ul class="pause-modal__examples">
                    <li><code>[say-as:digits]12345[/say-as]</code> — <span data-i18n="marker.sayas.digits">逐字读数字</span></li>
                    <li><code>[say-as:telephone]13800138000[/say-as]</code> — <span data-i18n="marker.sayas.tel">电话号码</span></li>
                    <li><code>[say-as:date]2026-05-24[/say-as]</code> — <span data-i18n="marker.sayas.date">日期</span></li>
                    <li><code>[say-as:characters]ABC[/say-as]</code> — <span data-i18n="marker.sayas.chars">逐字母读</span></li>
                </ul>
            </div>

            <div class="marker-help-section">
                <h3 class="marker-help-section__title" data-i18n="marker.section.sub">🔁 别名替换 sub</h3>
                <ul class="pause-modal__examples">
                    <li><code>[sub:北京]bj[/sub]</code> — <span data-i18n="marker.sub.example">把 "bj" 读作 "北京"</span></li>
                </ul>
            </div>

            <div class="pause-modal__example-box">
                <div class="pause-modal__example-label" data-i18n="marker.exampleLabel">综合示例：</div>
                <code class="pause-modal__example-code">大家好[pause:500ms][emphasis:strong]欢迎使用[/emphasis][pause:300ms][rate:slow]今天我要慢慢介绍[/rate]电话[say-as:telephone]13800138000[/say-as]</code>
            </div>

            <p class="pause-modal__limits" data-i18n="marker.limits">值不合法或未闭合时，该标记会原样保留为文本（不会报错）。单次停顿最长 5 秒，整段总停顿 ≤ 30 秒，全部指令上限 50 个。需要更复杂的标签（phoneme / lang / audio / 自定义词典）请用 SSML 模式。</p>

            <div class="pause-modal__footer">
                <label class="pause-modal__dontshow">
                    <input type="checkbox" id="pauseModalDontShow">
                    <span data-i18n="pause.dontShowAgain">不再自动显示</span>
                </label>
                <button type="button" class="pause-modal__ok" id="pauseModalOk" data-i18n="pause.gotIt">知道了</button>
            </div>
        </div>
    </div>

    <script>
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
            toast.className = 'toast'+ type;
            toast.innerHTML = '<span class=toast-icon>'+icons[type] || icons.info+'</span><span>'+message+'</span>';

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
        // 国际化翻译数据
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
                    text = text.replace(new RegExp('\\{'+param+'\\}', 'g'), params[param]);
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
            
            // 更新语言切换器
            updateLanguageSwitcher();
        }

        // 控制仅中文场景显示的元素：顶栏赞赏入口 + 成功面板赞赏区
        function applyZhOnlyVisibility() {
            // const isZh = currentLanguage === 'zh';
            // const tipTrigger = document.getElementById('tipTrigger');
            // const tipSection = document.getElementById('tipSection');
            // if (tipTrigger) tipTrigger.style.display = isZh ? '' : 'none';
            // if (tipSection) tipSection.style.display = isZh ? '' : 'none';
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
            button.innerHTML = '<span>'+icon+'</span><span data-i18n='+labelKey+'>'+t(labelKey)+'</span>';
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
            if (ssmlInputTab) {
                ssmlInputTab.addEventListener('click', function () { setActive('ssml'); });
            }

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
                alert('请选择txt格式的文本文件');
                return;
            }

            // 验证文件大小
            if (file.size > 500 * 1024) {
                alert('文件大小不能超过500KB');
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
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
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
                    alert('请输入要转换的文本内容');
                    return;
                }
            } else if (currentInputMethod === 'file') {
                if (!selectedFile) {
                    alert('请选择要上传的txt文件');
                    return;
                }
            }else if (currentInputMethod === 'ssml') {
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
                }else if (currentInputMethod === 'ssml') {
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
                    loadingText.textContent = '正在处理上传的文件...';
                    progressInfo.textContent = '文件: ' + selectedFile.name + ' (' + formatFileSize(selectedFile.size) + ')';
                    
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
                    throw new Error(errorData.error?.message || '生成失败');
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
                // setTimeout(() => {
                //     const wechatPromotion = document.getElementById('wechatPromotion');
                //     wechatPromotion.style.display = 'block';
                //     wechatPromotion.classList.add('fade-in');
                // }, 1000);
                
            } catch (err) {
                loading.style.display = 'none';
                error.style.display = 'block';
                
                // 根据错误类型显示不同的提示
                if (err.message.includes('Too many subrequests')) {
                    error.textContent = '错误: 文本过长导致请求过多，请缩短文本内容或分段处理';
                } else if (err.message.includes('频率限制') || err.message.includes('429')) {
                    error.textContent = '错误: 请求过于频繁，请稍后再试';
                } else if (err.message.includes('分块数量') && err.message.includes('超过限制')) {
                    error.textContent = '错误: ' + err.message;
                } else {
                    error.textContent = '错误: ' + err.message;
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
           // wechatPromotion.style.display = 'none';
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
                alert('请选择音频格式的文件（mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp）');
                return;
            }

            // 验证文件大小（限制为10MB）
            if (file.size > 10 * 1024 * 1024) {
                alert('音频文件大小不能超过10MB');
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
                alert('请选择要转录的音频文件');
                return;
            }
            
            // 获取Token配置
            const tokenOption = document.querySelector('input[name="tokenOption"]:checked').value;
            const customToken = document.getElementById('tokenInput').value;
            
            if (tokenOption === 'custom' && !customToken.trim()) {
                alert('请输入自定义Token');
                return;
            }
            
            // 重置状态
            transcriptionResult.style.display = 'block';
            transcriptionLoading.style.display = 'block';
            transcriptionSuccess.style.display = 'none';
            transcriptionError.style.display = 'none';
            transcribeBtn.disabled = true;
            transcribeBtn.textContent = '转录中...';
            
            // 更新加载提示
            const loadingText = document.getElementById('transcriptionLoadingText');
            const progressInfo = document.getElementById('transcriptionProgressInfo');
            loadingText.textContent = '正在转录音频，请稍候...';
            progressInfo.textContent = '文件: ' + selectedAudioFile.name + ' (' + formatFileSize(selectedAudioFile.size) + ')';
            
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
                    throw new Error(errorData.error?.message || '转录失败');
                }
                
                const result = await response.json();
                
                // 显示转录结果
                document.getElementById('transcriptionText').value = result.text || '';
                transcriptionLoading.style.display = 'none';
                transcriptionSuccess.style.display = 'block';
                
                // 显示公众号推广组件
                // setTimeout(() => {
                //     const wechatPromotion = document.getElementById('wechatPromotion');
                //     wechatPromotion.style.display = 'block';
                //     wechatPromotion.classList.add('fade-in');
                // }, 1000);
                
            } catch (err) {
                transcriptionLoading.style.display = 'none';
                transcriptionError.style.display = 'block';
                transcriptionError.textContent = '错误: ' + err.message;
            } finally {
                transcribeBtn.disabled = false;
                transcribeBtn.innerHTML = '<span>🎧</span><span>开始语音转录</span>';
            }
        });

        // 复制转录结果
        document.getElementById('copyTranscriptionBtn').addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText');
            transcriptionText.select();
            document.execCommand('copy');
            
            // 临时改变按钮文本
            const originalText = this.innerHTML;
            this.innerHTML = '<span>✅</span><span>已复制</span>';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });

        // 编辑转录结果
        document.getElementById('editTranscriptionBtn').addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText');
            const isReadonly = transcriptionText.readOnly;
            
            if (isReadonly) {
                transcriptionText.readOnly = false;
                transcriptionText.focus();
                this.innerHTML = '<span>💾</span><span>保存编辑</span>';
            } else {
                transcriptionText.readOnly = true;
                this.innerHTML = '<span>✏️</span><span>编辑文本</span>';
            }
        });

        // 转为语音功能
        document.getElementById('useForTtsBtn').addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText').value;
            
            if (!transcriptionText.trim()) {
                //alert('转录结果为空，无法转换为语音');
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
                const presetBtns = document.querySelectorAll('.preset-btn[data-target='+target+']');
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
            // const wechatBtn = document.getElementById('wechatBtn');
            // const qrcodePopup = document.getElementById('qrcodePopup');

            // if (wechatBtn && qrcodePopup) {
            //     wechatBtn.addEventListener('click', function(e) {
            //         e.stopPropagation();
            //         qrcodePopup.classList.toggle('show');
            //     });

            //     // 点击外部关闭弹窗
            //     document.addEventListener('click', function(e) {
            //         if (!qrcodePopup.contains(e.target) && e.target !== wechatBtn) {
            //             qrcodePopup.classList.remove('show');
            //         }
            //     });
            // }
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


    </script>
</body>
</html>
`;

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request);
    }
};

async function handleRequest(request) {
    if (request.method === "OPTIONS") {
        return handleOptions(request);
    }




    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 返回前端页面
    if (path === "/" || path === "/index.html") {
        return new Response(HTML_PAGE, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }

    if (path === "/v1/audio/transcriptions") {
        try {
            return await handleAudioTranscription(request);
        } catch (error) {
            console.error("Audio transcription error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "transcription_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }

    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            
            // 处理文件上传
            if (contentType.includes("multipart/form-data")) {
                return await handleFileUpload(request);
            }
            
            // 处理JSON请求（原有功能）
            const requestBody = await request.json();
            const {
                input,
                voice = "zh-CN-XiaoxiaoNeural",
                speed = '1.0',
                volume = '0',
                pitch = '0',
                style = "general"
            } = requestBody;

            let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
            let numVolume = parseInt(String(parseFloat(volume) * 100));
            let numPitch = parseInt(pitch);
            const response = await getVoice(
                input,
                voice,
                rate >= 0 ? `+${rate}%` : `${rate}%`,
                numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
                numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
                style,
                "audio-24khz-48kbitrate-mono-mp3"
            );

            return response;

        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "edge_tts_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }

    // 默认返回 404
    return new Response("Not Found", { status: 404 });
}

async function handleOptions(request) {
    return new Response(null, {
        status: 204,
        headers: {
            ...makeCORSHeaders(),
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "Authorization"
        }
    });
}

// 添加延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 优化文本分块函数
function optimizedTextSplit(text, maxChunkSize = 1500) {
    const chunks = [];
    const sentences = text.split(/[。！？\n]/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;
        
        // 如果单个句子就超过最大长度，按字符分割
        if (trimmedSentence.length > maxChunkSize) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            // 按字符分割长句子
            for (let i = 0; i < trimmedSentence.length; i += maxChunkSize) {
                chunks.push(trimmedSentence.slice(i, i + maxChunkSize));
            }
        } else if ((currentChunk + trimmedSentence).length > maxChunkSize) {
            // 当前块加上新句子会超过限制，先保存当前块
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = trimmedSentence;
        } else {
            // 添加到当前块
            currentChunk += (currentChunk ? '。' : '') + trimmedSentence;
        }
    }
    
    // 添加最后一个块
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 0);
}

// 批量处理音频块
async function processBatchedAudioChunks(chunks, voiceName, rate, pitch, volume, style, outputFormat, batchSize = 3, delayMs = 1000) {
    const audioChunks = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchPromises = batch.map(async (chunk, index) => {
            try {
                // 为每个请求添加小延迟，避免同时发送
                if (index > 0) {
                    await delay(index * 200);
                }
                return await getAudioChunk(chunk, voiceName, rate, pitch, volume, style, outputFormat);
            } catch (error) {
                console.error(`处理音频块失败 (批次 ${Math.floor(i/batchSize) + 1}, 块 ${index + 1}):`, error);
                throw error;
            }
        });
        
        try {
            const batchResults = await Promise.all(batchPromises);
            audioChunks.push(...batchResults);
            
            // 批次间延迟
            if (i + batchSize < chunks.length) {
                await delay(delayMs);
            }
        } catch (error) {
            console.error(`批次处理失败:`, error);
            throw error;
        }
    }
    
    return audioChunks;
}

async function getVoice(text, voiceName = "zh-CN-XiaoxiaoNeural", rate = '+0%', pitch = '+0Hz', volume = '+0%', style = "general", outputFormat = "audio-24khz-48kbitrate-mono-mp3") {
    try {
        // 文本预处理
        const cleanText = text.trim();
        if (!cleanText) {
            throw new Error("文本内容为空");
        }
        
        // 如果文本很短，直接处理
        if (cleanText.length <= 1500) {
            const audioBlob = await getAudioChunk(cleanText, voiceName, rate, pitch, volume, style, outputFormat);
            return new Response(audioBlob, {
                headers: {
                    "Content-Type": "audio/mpeg",
                    ...makeCORSHeaders()
                }
            });
        }

        // 优化的文本分块
        const chunks = optimizedTextSplit(cleanText, 1500);
        
        // 检查分块数量，防止超过CloudFlare限制
        if (chunks.length > 40) {
            throw new Error(`文本过长，分块数量(${chunks.length})超过限制。请缩短文本或分批处理。`);
        }
        
        console.log(`文本已分为 ${chunks.length} 个块进行处理`);

        // 批量处理音频块，控制并发数量和频率
        const audioChunks = await processBatchedAudioChunks(
            chunks, 
            voiceName, 
            rate, 
            pitch, 
            volume, 
            style, 
            outputFormat,
            3,  // 每批处理3个
            800 // 批次间延迟800ms
        );

        // 将音频片段拼接起来
        const concatenatedAudio = new Blob(audioChunks, { type: 'audio/mpeg' });
        return new Response(concatenatedAudio, {
            headers: {
                "Content-Type": "audio/mpeg",
                ...makeCORSHeaders()
            }
        });

    } catch (error) {
        console.error("语音合成失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: error.message || String(error),
                type: "api_error",
                param: `${voiceName}, ${rate}, ${pitch}, ${volume}, ${style}, ${outputFormat}`,
                code: "edge_tts_error"
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}



//获取单个音频数据（增强错误处理和重试机制）
async function getAudioChunk(text, voiceName, rate, pitch, volume, style, outputFormat = 'audio-24khz-48kbitrate-mono-mp3', maxRetries = 3) {
    const retryDelay = 500; // 重试延迟500ms
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const endpoint = await getEndpoint();
            const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;
            
            // 处理文本中的延迟标记
            let m = text.match(/\[(\d+)\]\s*?$/);
            let slien = 0;
            if (m && m.length == 2) {
                slien = parseInt(m[1]);
                text = text.replace(m[0], '');
            }
            
            // 验证文本长度
            if (!text.trim()) {
                throw new Error("文本块为空");
            }
            
            if (text.length > 2000) {
                throw new Error(`文本块过长: ${text.length} 字符，最大支持2000字符`);
            }
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": endpoint.t,
                    "Content-Type": "application/ssml+xml",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                    "X-Microsoft-OutputFormat": outputFormat
                },
                body: getSsml(text, voiceName, rate, pitch, volume, style, slien)
            });

            if (!response.ok) {
                const errorText = await response.text();
                
                // 根据错误类型决定是否重试
                if (response.status === 429) {
                    // 频率限制，需要重试
                    if (attempt < maxRetries) {
                        console.log(`频率限制，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`请求频率过高，已重试${maxRetries}次仍失败`);
                } else if (response.status >= 500) {
                    // 服务器错误，可以重试
                    if (attempt < maxRetries) {
                        console.log(`服务器错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`Edge TTS服务器错误: ${response.status} ${errorText}`);
                } else {
                    // 客户端错误，不重试
                    throw new Error(`Edge TTS API错误: ${response.status} ${errorText}`);
                }
            }

            return await response.blob();
            
        } catch (error) {
            if (attempt === maxRetries) {
                // 最后一次重试失败
                throw new Error(`音频生成失败（已重试${maxRetries}次）: ${error.message}`);
            }
            
            // 如果是网络错误或其他可重试错误
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log(`网络错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                await delay(retryDelay * (attempt + 1));
                continue;
            }
            
            // 其他错误直接抛出
            throw error;
        }
    }
}

// XML文本转义函数
function escapeXmlText(text) {
    return text
        .replace(/&/g, '&amp;')   // 必须首先处理 &
        .replace(/</g, '&lt;')    // 处理 <
        .replace(/>/g, '&gt;')    // 处理 >
        .replace(/"/g, '&quot;')  // 处理 "
        .replace(/'/g, '&apos;'); // 处理 '
}

function getSsml(text, voiceName, rate, pitch, volume, style, slien = 0) {
    // 对文本进行XML转义
    const escapedText = escapeXmlText(text);
    
    let slien_str = '';
    if (slien > 0) {
        slien_str = `<break time="${slien}ms" />`
    }
    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN"> 
                <voice name="${voiceName}"> 
                    <mstts:express-as style="${style}"  styledegree="2.0" role="default" > 
                        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${escapedText}</prosody> 
                    </mstts:express-as> 
                    ${slien_str}
                </voice> 
            </speak>`;

}

async function getEndpoint() {
    const now = Date.now() / 1000;

    if (tokenInfo.token && tokenInfo.expiredAt && now < tokenInfo.expiredAt - TOKEN_REFRESH_BEFORE_EXPIRY) {
        return tokenInfo.endpoint;
    }

    // 获取新token
    const endpointUrl = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0";
    const clientId = crypto.randomUUID().replace(/-/g, "");

    try {
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Accept-Language": "zh-Hans",
                "X-ClientVersion": "4.0.530a 5fe1dc6c",
                "X-UserId": "0f04d16a175c411e",
                "X-HomeGeographicRegion": "zh-Hans-CN",
                "X-ClientTraceId": clientId,
                "X-MT-Signature": await sign(endpointUrl),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": "0",
                "Accept-Encoding": "gzip"
            }
        });

        if (!response.ok) {
            throw new Error(`获取endpoint失败: ${response.status}`);
        }

        const data = await response.json();
        const jwt = data.t.split(".")[1];
        const decodedJwt = JSON.parse(atob(jwt));

        tokenInfo = {
            endpoint: data,
            token: data.t,
            expiredAt: decodedJwt.exp
        };

        return data;

    } catch (error) {
        console.error("获取endpoint失败:", error);
        // 如果有缓存的token，即使过期也尝试使用
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}



function makeCORSHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Max-Age": "86400"
    };
}

async function hmacSha256(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
    return new Uint8Array(signature);
}

async function base64ToBytes(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function bytesToBase64(bytes) {
    return btoa(String.fromCharCode.apply(null, bytes));
}

function uuid() {
    return crypto.randomUUID().replace(/-/g, "");
}

async function sign(urlStr) {
    const url = urlStr.split("://")[1];
    const encodedUrl = encodeURIComponent(url);
    const uuidStr = uuid();
    const formattedDate = dateFormat();
    const bytesToSign = `MSTranslatorAndroidApp${encodedUrl}${formattedDate}${uuidStr}`.toLowerCase();
    const decode = await base64ToBytes("oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw==");
    const signData = await hmacSha256(decode, bytesToSign);
    const signBase64 = await bytesToBase64(signData);
    return `MSTranslatorAndroidApp::${signBase64}::${formattedDate}::${uuidStr}`;
}

function dateFormat() {
    const formattedDate = (new Date()).toUTCString().replace(/GMT/, "").trim() + " GMT";
    return formattedDate.toLowerCase();
}

// 处理文件上传的函数
async function handleFileUpload(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const voice = formData.get('voice') || 'zh-CN-XiaoxiaoNeural';
        const speed = formData.get('speed') || '1.0';
        const volume = formData.get('volume') || '0';
        const pitch = formData.get('pitch') || '0';
        const style = formData.get('style') || 'general';

        // 验证文件
        if (!file) {
            return new Response(JSON.stringify({
                error: {
                    message: "未找到上传的文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "missing_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件类型
        if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
            return new Response(JSON.stringify({
                error: {
                    message: "不支持的文件类型，请上传txt文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "invalid_file_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件大小（限制为500KB）
        if (file.size > 500 * 1024) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件大小超过限制（最大500KB）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "file_too_large"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 读取文件内容
        const text = await file.text();
        
        // 验证文本内容
        if (!text.trim()) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件内容为空",
                    type: "invalid_request_error",
                    param: "file",
                    code: "empty_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 文本长度限制（10000字符）
        if (text.length > 10000) {
            return new Response(JSON.stringify({
                error: {
                    message: "文本内容过长（最大10000字符）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "text_too_long"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 处理参数格式，与原有逻辑保持一致
        let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
        let numVolume = parseInt(String(parseFloat(volume) * 100));
        let numPitch = parseInt(pitch);

        // 调用TTS服务
        return await getVoice(
            text,
            voice,
            rate >= 0 ? `+${rate}%` : `${rate}%`,
            numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
            numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
            style,
            "audio-24khz-48kbitrate-mono-mp3"
        );

    } catch (error) {
        console.error("文件上传处理失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: "文件处理失败",
                type: "api_error",
                param: null,
                code: "file_processing_error"
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}

// 处理语音转录的函数
async function handleAudioTranscription(request) {
    try {
        // 验证请求方法
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({
                error: {
                    message: "只支持POST方法",
                    type: "invalid_request_error",
                    param: "method",
                    code: "method_not_allowed"
                }
            }), {
                status: 405,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        const contentType = request.headers.get("content-type") || "";
        
        // 验证Content-Type
        if (!contentType.includes("multipart/form-data")) {
            return new Response(JSON.stringify({
                error: {
                    message: "请求必须使用multipart/form-data格式",
                    type: "invalid_request_error",
                    param: "content-type",
                    code: "invalid_content_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 解析FormData
        const formData = await request.formData();
        const audioFile = formData.get('file');
        const customToken = formData.get('token');

        // 验证音频文件
        if (!audioFile) {
            return new Response(JSON.stringify({
                error: {
                    message: "未找到音频文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "missing_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件大小（限制为10MB）
        if (audioFile.size > 10 * 1024 * 1024) {
            return new Response(JSON.stringify({
                error: {
                    message: "音频文件大小不能超过10MB",
                    type: "invalid_request_error",
                    param: "file",
                    code: "file_too_large"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证音频文件格式
        const allowedTypes = [
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/flac', 'audio/aac',
            'audio/ogg', 'audio/webm', 'audio/amr', 'audio/3gpp'
        ];
        
        const isValidType = allowedTypes.some(type => 
            audioFile.type.includes(type) || 
            audioFile.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i)
        );

        if (!isValidType) {
            return new Response(JSON.stringify({
                error: {
                    message: "不支持的音频文件格式，请上传mp3、wav、m4a、flac、aac、ogg、webm、amr或3gp格式的文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "invalid_file_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 使用默认token或用户提供的token
        const token = customToken || 'sk-wtldsvuprmwltxpbspbmawtolbacghzawnjhtlzlnujjkfhh';

        // 构建发送到硅基流动API的FormData
        const apiFormData = new FormData();
        apiFormData.append('file', audioFile);
        apiFormData.append('model', 'FunAudioLLM/SenseVoiceSmall');

        // 发送请求到硅基流动API
        const apiResponse = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: apiFormData
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('硅基流动API错误:', apiResponse.status, errorText);
            
            let errorMessage = '语音转录服务暂时不可用';
            
            if (apiResponse.status === 401) {
                errorMessage = 'API Token无效，请检查您的配置';
            } else if (apiResponse.status === 429) {
                errorMessage = '请求过于频繁，请稍后再试';
            } else if (apiResponse.status === 413) {
                errorMessage = '音频文件太大，请选择较小的文件';
            }

            return new Response(JSON.stringify({
                error: {
                    message: errorMessage,
                    type: "api_error",
                    param: null,
                    code: "transcription_api_error"
                }
            }), {
                status: apiResponse.status,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 获取转录结果
        const transcriptionResult = await apiResponse.json();

        // 返回转录结果
        return new Response(JSON.stringify(transcriptionResult), {
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });

    } catch (error) {
        console.error("语音转录处理失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: "语音转录处理失败",
                type: "api_error",
                param: null,
                code: "transcription_processing_error"
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}

