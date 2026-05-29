(function() {
  'use strict';

  var CONFIG = {
    apiUrl: 'https://flent-attribution-api.pages.dev/api/attrib/click',
    calComUrls: ['cal.com/'],
    storageKey: 'wax_attribution',
    debug: false
  };
  var WHATSAPP_NUMBER = ((window.__FLENT_WHATSAPP_NUMBER__ || '') + '').replace(/\D/g, '');

  function buildWhatsAppLink(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function log() {
    if (CONFIG.debug) {
      console.log.apply(console, ['[WAX Attribution]'].concat(Array.prototype.slice.call(arguments)));
    }
  }

  function generateSessionCode() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var code = 'WAX-';
    for (var i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function getUrlParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content'),
      gclid: params.get('gclid'),
      gbraid: params.get('gbraid'),
      wbraid: params.get('wbraid'),
      fbclid: params.get('fbclid')
    };
  }

  function getAttributionData() {
    try {
      var stored = localStorage.getItem(CONFIG.storageKey);
      if (stored) {
        var data = JSON.parse(stored);
        log('Found existing attribution data:', data);
        return data;
      }
    } catch (error) {
      console.error('Error reading attribution data:', error);
    }
    return null;
  }

  function saveAttributionData(data) {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
      log('Saved attribution data:', data);
      try {
        window.dispatchEvent(new CustomEvent('wax:ready', {
          detail: { code: data && data.sessionCode }
        }));
      } catch (e) {}
    } catch (error) {
      console.error('Error saving attribution data:', error);
    }
  }

  async function sendToApi(data) {
    try {
      var response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionCode: data.sessionCode,
          page: data.landingPage,
          utmPayload: data.utm,
          first_touch_utm_source: data.first_touch_utm_source,
          first_touch_utm_medium: data.first_touch_utm_medium,
          first_touch_utm_campaign: data.first_touch_utm_campaign,
          first_touch_utm_term: data.first_touch_utm_term,
          first_touch_utm_content: data.first_touch_utm_content
        })
      });

      if (!response.ok) {
        throw new Error('API error: ' + response.status);
      }

      var result = await response.json();
      log('API response:', result);
      return result.ok;
    } catch (error) {
      console.error('Error sending to API:', error);
      return false;
    }
  }

  function isCalComLink(url) {
    if (!url) return false;
    var href = url.toLowerCase();
    return CONFIG.calComUrls.some(function(calUrl) { return href.includes(calUrl); });
  }

  function appendWaxToCalComLinks() {
    var attribution = getAttributionData();
    if (!attribution || !attribution.sessionCode) {
      log('No WAX code available to append');
      return;
    }

    var waxCode = attribution.sessionCode;
    log('Appending WAX code to Cal.com links:', waxCode);

    var links = document.querySelectorAll('a[href]');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (isCalComLink(href)) {
        try {
          var url = new URL(href, window.location.origin);
          url.searchParams.set('wax_code', waxCode);
          link.setAttribute('href', url.toString());
          log('Updated Cal.com link:', link.href);
        } catch (error) {
          console.error('Error updating Cal.com link:', error);
        }
      }
    });
  }

  function createFloatingWhatsAppButton() {
    var pathname = window.location.pathname;
    if (pathname.startsWith('/homes/') || pathname.startsWith('/secured') || pathname.startsWith('/collections/')) {
      var existing = document.querySelector('.whatsapp-float');
      if (existing) existing.remove();
      return;
    }

    if (document.querySelector('.whatsapp-float')) return;

    var attribution = getAttributionData();
    var waxCode = attribution ? (attribution.sessionCode || '') : '';

    var isOwnersPage = pathname === '/owners';
    var defaultWhatsAppLink = buildWhatsAppLink('Curious to know more about Flent-tell me everything!');
    var ownersWhatsAppLink = buildWhatsAppLink("Hi, I'm a homeowner. How can Flent help?");
    var whatsappHref = isOwnersPage ? ownersWhatsAppLink : defaultWhatsAppLink;

    var button = document.createElement('a');
    button.className = 'whatsapp-float';
    button.href = whatsappHref;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.setAttribute('aria-label', 'Chat with us on WhatsApp');

    button.onclick = function(e) {
      e.preventDefault();
      var href = this.href;
      window.open(href, '_blank', 'noopener,noreferrer');
      if (window.gtag) {
        window.gtag('event', 'conversion', { 'send_to': 'AW-16885482628/LlGRCKmzrsgaEISJ0PM-' });
      }
    };

    button.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.977 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>' +
      '</svg>';

    var styleId = 'whatsapp-float-styles';
    if (!document.getElementById(styleId)) {
      var style = document.createElement('style');
      style.id = styleId;
      style.textContent =
        '.whatsapp-float{position:fixed;width:60px;height:60px;bottom:24px;right:24px;background:#000;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:2px 2px 8px rgba(0,0,0,.15);z-index:9999;pointer-events:auto;cursor:pointer;transition:background .3s;text-decoration:none}' +
        '.whatsapp-float:hover{background:#222}' +
        '.whatsapp-float svg{color:#fff}' +
        '@media(max-width:600px){.whatsapp-float{width:48px;height:48px;bottom:16px;right:16px}.whatsapp-float svg{width:24px;height:24px}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(button);

    if (waxCode) {
      try {
        var url = new URL(button.href);
        var text = url.searchParams.get('text') || '';
        if (!text.includes('[WAX-')) {
          var newText = text + (text ? ' ' : '') + '[' + waxCode + ']';
          url.searchParams.set('text', newText);
          button.href = url.toString();
        }
      } catch (error) {
        console.error('Error updating floating button with WAX code:', error);
      }
    }
  }

  function enhanceWhatsAppLinks() {
    var attribution = getAttributionData();
    if (!attribution || !attribution.sessionCode) return;

    var waxCode = attribution.sessionCode;
    var whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');

    whatsappLinks.forEach(function(link) {
      try {
        var url = new URL(link.href);
        var text = url.searchParams.get('text') || '';
        if (!text.includes('[WAX-')) {
          var newText = text + (text ? ' ' : '') + '[' + waxCode + ']';
          url.searchParams.set('text', newText);
          link.setAttribute('href', url.toString());
          log('Enhanced WhatsApp link with WAX code');
        }
      } catch (error) {
        console.error('Error enhancing WhatsApp link:', error);
      }
    });
  }

  function init() {
    log('Initializing attribution tracking...');

    var urlParams = getUrlParams();
    var attribution = getAttributionData();
    var isFreshRecord = !attribution;

    var hasAttribution = Object.values(urlParams).some(function(v) { return v !== null; });

    if (hasAttribution || !attribution) {
      var sessionCode = attribution ? (attribution.sessionCode || generateSessionCode()) : generateSessionCode();

      var filteredParams = {};
      Object.keys(urlParams).forEach(function(k) {
        if (urlParams[k] !== null) filteredParams[k] = urlParams[k];
      });

      attribution = {
        sessionCode: sessionCode,
        landingPage: window.location.href,
        firstTouch: attribution ? (attribution.firstTouch || Date.now()) : Date.now(),
        lastTouch: Date.now(),
        utm: Object.assign({}, attribution ? attribution.utm : {}, filteredParams),
        // First-touch UTM dimensions are locked on the literal first visit of a WAX
        // session and never overwritten thereafter. utm_source defaults to "organic"
        // when no UTM is present on the first visit. Migrated records (no prior
        // first_touch_* fields) intentionally stay undefined — we can't fabricate a
        // historical first-touch we never observed.
        first_touch_utm_source: isFreshRecord ? (urlParams.utm_source || 'organic') : attribution.first_touch_utm_source,
        first_touch_utm_medium: isFreshRecord ? urlParams.utm_medium : attribution.first_touch_utm_medium,
        first_touch_utm_campaign: isFreshRecord ? urlParams.utm_campaign : attribution.first_touch_utm_campaign,
        first_touch_utm_term: isFreshRecord ? urlParams.utm_term : attribution.first_touch_utm_term,
        first_touch_utm_content: isFreshRecord ? urlParams.utm_content : attribution.first_touch_utm_content
      };

      saveAttributionData(attribution);

      // POST on the literal first visit even without UTMs, so organic-only converters
      // still produce a KV record by the time HubSpot fetches at conversion time.
      if (hasAttribution || isFreshRecord) {
        sendToApi(attribution);
      }
    }

    createFloatingWhatsAppButton();

    var desktopMediaQuery = window.matchMedia('(min-width: 768px)');
    desktopMediaQuery.addEventListener('change', function() {
      createFloatingWhatsAppButton();
    });

    enhanceWhatsAppLinks();
    appendWaxToCalComLinks();

    var observer = new MutationObserver(function() {
      createFloatingWhatsAppButton();
      enhanceWhatsAppLinks();
      appendWaxToCalComLinks();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    log('Attribution tracking initialized with code:', attribution.sessionCode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', function() {
    enhanceWhatsAppLinks();
    appendWaxToCalComLinks();
  });
})();
