(function () {
  if (typeof window === 'undefined') return;
  if (window.__myVoiceAgentBootstrapLoaded) return;
  window.__myVoiceAgentBootstrapLoaded = true;

  var globalConfig = window.MyVoiceAgent || window.myVoiceAgent || {};
  var scriptEl = document.currentScript || document.querySelector('script[data-public-id]');

  function pickConfig(key, fallback) {
    var datasetValue = scriptEl && scriptEl.dataset ? scriptEl.dataset[key] : undefined;
    if (datasetValue !== undefined && datasetValue !== '') return datasetValue;
    if (globalConfig[key] !== undefined && globalConfig[key] !== '') return globalConfig[key];
    return fallback;
  }

  function coerceBoolean(value) {
    if (value == null) return false;
    if (typeof value === 'string') {
      var normalized = value.toLowerCase();
      return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
    }
    return Boolean(value);
  }

  var publicId = pickConfig('publicId') || pickConfig('public_id');
  if (!publicId) {
    console.error('[MyVoiceAgent] Missing publicId. Provide window.MyVoiceAgent.publicId or data-public-id on the script tag.');
    return;
  }

  var baseUrl = pickConfig('baseUrl');
  if (!baseUrl) {
    var src = scriptEl && scriptEl.src ? scriptEl.src : window.location.href;
    try {
      baseUrl = new URL(src).origin;
    } catch (err) {
      console.warn('[MyVoiceAgent] Failed to derive base URL, falling back to window.location origin.', err);
      baseUrl = window.location.origin;
    }
  }
  baseUrl = (baseUrl || '').replace(/\/$/, '');

  var theme = (pickConfig('theme', 'dark') || 'dark').toLowerCase();
  theme = theme === 'light' ? 'light' : 'dark';
  var isWidget = coerceBoolean(pickConfig('widget'));

  var search = new URLSearchParams();
  if (theme === 'light') search.set('theme', 'light');
  if (isWidget) search.set('widget', '1');

  var iframeSrc = baseUrl + '/embed/agent/' + encodeURIComponent(publicId);
  var serialized = search.toString();
  if (serialized) iframeSrc += '?' + serialized;

  var width = pickConfig('width', '100%');
  var height = pickConfig('height', isWidget ? '520px' : '640px');
  var hideShadow = coerceBoolean(pickConfig('noShadow'));
  var rounded = coerceBoolean(pickConfig('rounded'));
  var targetSelector = pickConfig('target');

  function createContainer() {
    var container;
    if (targetSelector) {
      container = document.querySelector(targetSelector);
      if (!container) {
        console.warn('[MyVoiceAgent] Unable to find target container "' + targetSelector + '". Falling back to auto insertion.');
      }
    }
    if (!container) {
      container = document.createElement('div');
      container.id = pickConfig('containerId', 'my-voice-agent-embed');
      container.style.position = 'relative';
      container.style.width = width;
      container.style.maxWidth = pickConfig('maxWidth', isWidget ? '420px' : '680px');
      container.style.margin = pickConfig('centered', '1') ? '0 auto' : '0';
      if (!hideShadow) {
        container.style.boxShadow = '0 20px 60px rgba(15,23,42,0.18)';
      }
      if (rounded) {
        container.style.borderRadius = '24px';
        container.style.overflow = 'hidden';
      }
      document.body ? document.body.appendChild(container) : document.documentElement.appendChild(container);
    }
    return container;
  }

  function inject() {
    var container = createContainer();
    if (!container) return;
    var iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.setAttribute('title', pickConfig('title', 'AI Agent Chat'));
    iframe.setAttribute('allow', 'microphone');
    iframe.style.width = '100%';
    iframe.style.height = height;
    iframe.style.border = '0';
    iframe.style.background = 'transparent';
    container.innerHTML = '';
    container.appendChild(iframe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }
})();
