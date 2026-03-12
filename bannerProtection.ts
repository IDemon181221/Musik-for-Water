/**
 * AGGRESSIVE Banner Protection System
 * Удаляет внешние баннеры, опросы и tracking элементы Arena
 */

const BANNED_SELECTORS = [
  // Floating banner
  '.floating-banner',
  '#floating-banner',
  '[class*="floating-banner"]',
  '[id*="floating-banner"]',
  '[onclick*="dismissBanner"]',
  '[onclick*="reportContent"]',
  '.banner-link-wrapper',
  '.banner-logo',
  '.banner-text-container',
  '[href*="arena.ai"]',
  'a[href*="arena.ai/code"]',
  '.banner-padding',
  '.banner-action-container',
  '.report-content-btn',
  // Survey forms
  '.survey-form',
  '[name="surveyForm"]',
  '.survey-box',
  '.question-container',
  '.question-header',
  '.survey-question',
  '.survey-question-description',
  '.multiple-choice-options',
  '.response-choice',
  '.form-cancel',
  '.form-submit',
  '[class*="survey"]',
  '[id*="survey"]',
  '[name*="survey"]',
  'form[name*="survey"]',
  // PostHog
  '[class*="posthog"]',
  '[id*="posthog"]',
  '.ph-survey',
  '.PostHogSurvey',
  'div.ph-survey-widget',
  // SweetAlert2
  '.swal2-container',
  '.swal2-popup',
  '.swal2-backdrop-show',
  // Generic selectors
  '[aria-label*="survey"]',
  '[aria-label*="Survey"]',
  '[aria-label*="Тщательное обследование"]',
  '[aria-label*="Отправить опрос"]',
  '[aria-label*="report"]',
  '[aria-label*="Report"]',
  '[aria-label*="Содержание отчёта"]',
  '[aria-label*="Закрытие баннера"]',
];

const BANNED_TEXT_PATTERNS = [
  'arena.ai',
  'dismissBanner',
  'reportContent',
  'Построено совместно с Arena',
  'Content is user-generated',
  'Code Arena',
  'posthog',
  'Предварительный просмотр кода отчета',
  'Зачем ты это сообщаешь',
  'Нарушение авторских прав',
  'Нарушение товарного знака',
  'surveyQuestion',
  'survey-form',
  'Тщательное обследование',
];

/**
 * Проверяет, содержит ли элемент запрещённый текст
 */
function containsBannedText(element: Element): boolean {
  const text = element.textContent || '';
  const html = element.innerHTML || '';
  
  return BANNED_TEXT_PATTERNS.some(pattern => 
    text.includes(pattern) || html.includes(pattern)
  );
}

/**
 * Удаляет баннеры из указанного документа
 */
function removeBannersFromDocument(doc: Document): number {
  let removed = 0;
  
  // Удаление по селекторам
  BANNED_SELECTORS.forEach(selector => {
    try {
      const elements = doc.querySelectorAll(selector);
      elements.forEach(el => {
        // Не удаляем элементы внутри нашего приложения
        if (!el.closest('#root') && !el.closest('[data-game]')) {
          console.log('[BannerProtection] Removing by selector:', selector);
          el.remove();
          removed++;
        }
      });
    } catch (e) {}
  });
  
  // Удаление по содержимому текста
  try {
    const allElements = doc.querySelectorAll('div, form, section, aside, dialog');
    allElements.forEach(el => {
      if (!el.closest('#root') && !el.closest('[data-game]') && containsBannedText(el)) {
        // Проверяем, не является ли это родительским элементом игры
        if (!el.querySelector('#root') && !el.querySelector('[data-game]')) {
          console.log('[BannerProtection] Removing by text content');
          el.remove();
          removed++;
        }
      }
    });
  } catch (e) {}
  
  // Специально ищем формы опросов
  try {
    const forms = doc.querySelectorAll('form');
    forms.forEach(form => {
      const hasRadios = form.querySelectorAll('input[type="radio"]').length > 3;
      const hasSubmit = form.querySelector('[type="button"], [type="submit"]');
      const hasSurveyClass = form.className.includes('survey') || form.getAttribute('name')?.includes('survey');
      
      if ((hasRadios && hasSubmit) || hasSurveyClass) {
        if (!form.closest('#root') && !form.closest('[data-game]')) {
          console.log('[BannerProtection] Removing survey form');
          form.remove();
          removed++;
        }
      }
    });
  } catch (e) {}
  
  return removed;
}

/**
 * Внедряет CSS для скрытия баннеров и опросов
 */
function injectHidingCSS(doc: Document): void {
  try {
    if (doc.getElementById('banner-hide-style-aggressive')) return;
    
    const style = doc.createElement('style');
    style.id = 'banner-hide-style-aggressive';
    style.textContent = `
      /* Banner hiding */
      .floating-banner,
      #floating-banner,
      [class*="floating-banner"],
      [id*="floating-banner"],
      [onclick*="dismissBanner"],
      [onclick*="reportContent"],
      a[href*="arena.ai/code"],
      .banner-link-wrapper,
      .banner-padding,
      .banner-action-container,
      .report-content-btn,
      div.floating-banner,
      /* Survey hiding */
      .survey-form,
      [name="surveyForm"],
      form[name*="survey"],
      .survey-box,
      .question-container,
      [class*="survey"],
      [id*="survey"],
      .ph-survey,
      .PostHogSurvey,
      div.ph-survey-widget,
      /* SweetAlert hiding */
      .swal2-container,
      .swal2-popup,
      .swal2-backdrop-show,
      /* PostHog hiding */
      [class*="posthog"],
      [id*="posthog"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -99999px !important;
        top: -99999px !important;
        width: 0 !important;
        height: 0 !important;
        max-width: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        clip: rect(0,0,0,0) !important;
        z-index: -99999 !important;
        transform: scale(0) !important;
      }
      
      /* Disable posthog scripts */
      script[src*="posthog"],
      script[src*="ph/static"] {
        display: none !important;
      }
    `;
    
    const target = doc.head || doc.documentElement;
    if (target) {
      target.appendChild(style);
      console.log('[BannerProtection] CSS injected into:', doc.location?.href || 'document');
    }
  } catch (e) {
    console.log('[BannerProtection] CSS injection failed:', e);
  }
}

/**
 * Пытается нажать кнопку закрытия баннера и опроса
 */
function tryDismissAll(): void {
  // Метод 1: Вызвать функцию dismissBanner напрямую
  try {
    const parentWindow = window.parent as any;
    if (parentWindow && parentWindow.dismissBanner) {
      parentWindow.dismissBanner({ preventDefault: () => {}, stopPropagation: () => {} });
      console.log('[BannerProtection] Called parent dismissBanner()');
    }
  } catch (e) {}

  // Метод 2: Кликнуть на кнопки закрытия
  try {
    const parentDoc = window.parent?.document;
    if (parentDoc) {
      // Кнопки баннера
      const closeButtons = parentDoc.querySelectorAll(
        '[onclick*="dismissBanner"], .action-btn, .form-cancel, [aria-label*="Закрытие"], [aria-label*="Тщательное обследование"]'
      );
      closeButtons.forEach((btn: any) => {
        try {
          btn.click();
          console.log('[BannerProtection] Clicked close button');
        } catch (e) {}
      });
    }
  } catch (e) {}

  // Метод 3: PostMessage
  try {
    window.parent?.postMessage({ type: 'DISMISS_BANNER' }, '*');
    window.parent?.postMessage({ type: 'CLOSE_SURVEY' }, '*');
    window.top?.postMessage({ type: 'DISMISS_BANNER' }, '*');
    window.top?.postMessage({ type: 'CLOSE_SURVEY' }, '*');
  } catch (e) {}
  
  // Метод 4: Отключить PostHog
  try {
    const parentWindow = window.parent as any;
    if (parentWindow?.posthog) {
      parentWindow.posthog.opt_out_capturing?.();
      parentWindow.posthog.reset?.();
      console.log('[BannerProtection] Disabled PostHog');
    }
  } catch (e) {}
}

/**
 * Очищает все доступные документы
 */
function cleanAllDocuments(): void {
  // Очистка текущего документа
  injectHidingCSS(document);
  removeBannersFromDocument(document);
  
  // Попытка очистить родительский документ
  try {
    if (window.parent && window.parent !== window) {
      injectHidingCSS(window.parent.document);
      removeBannersFromDocument(window.parent.document);
    }
  } catch (e) {
    // Cross-origin - ожидаемо
  }
  
  // Попытка очистить top документ
  try {
    if (window.top && window.top !== window) {
      injectHidingCSS(window.top.document);
      removeBannersFromDocument(window.top.document);
    }
  } catch (e) {
    // Cross-origin - ожидаемо
  }
}

/**
 * Создаёт защитный оверлей
 */
function createProtectiveOverlay(): void {
  // Оверлей в нижнем правом углу где обычно появляется баннер
  if (document.getElementById('banner-protection-overlay')) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'banner-protection-overlay';
  overlay.setAttribute('data-game', 'true');
  overlay.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    width: 450px;
    height: 150px;
    z-index: 2147483640;
    pointer-events: none;
    background: transparent;
  `;
  document.body?.appendChild(overlay);
  
  // Дополнительный оверлей для центра экрана (где появляются опросы)
  const centerOverlay = document.createElement('div');
  centerOverlay.id = 'survey-protection-overlay';
  centerOverlay.setAttribute('data-game', 'true');
  centerOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    pointer-events: none;
    background: transparent;
  `;
  document.body?.appendChild(centerOverlay);
}

/**
 * Запуск защиты
 */
export function startBannerProtection(): void {
  console.log('[BannerProtection] Starting aggressive protection...');
  
  // Пометить root как игровой элемент
  const root = document.getElementById('root');
  if (root) {
    root.setAttribute('data-game', 'true');
  }
  
  // Сразу пробуем закрыть всё
  tryDismissAll();
  cleanAllDocuments();
  
  // При загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      tryDismissAll();
      cleanAllDocuments();
      createProtectiveOverlay();
    });
  } else {
    createProtectiveOverlay();
  }
  
  // При полной загрузке
  window.addEventListener('load', () => {
    tryDismissAll();
    cleanAllDocuments();
  });
  
  // Периодическая проверка - агрессивно в начале, затем реже
  let attempts = 0;
  const fastInterval = setInterval(() => {
    tryDismissAll();
    cleanAllDocuments();
    attempts++;
    
    if (attempts > 60) { // После 30 секунд (500ms * 60)
      clearInterval(fastInterval);
      // Продолжаем с более редкой проверкой
      setInterval(() => {
        cleanAllDocuments();
      }, 2000);
    }
  }, 500);
  
  // Наблюдатель за DOM
  const observer = new MutationObserver((mutations) => {
    // Проверяем, не добавились ли новые элементы
    let shouldClean = false;
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof Element) {
          const className = node.className || '';
          const id = node.id || '';
          if (
            className.includes('survey') || 
            className.includes('banner') ||
            className.includes('posthog') ||
            className.includes('swal2') ||
            id.includes('survey') ||
            id.includes('banner') ||
            id.includes('posthog')
          ) {
            shouldClean = true;
          }
        }
      });
    });
    
    if (shouldClean) {
      cleanAllDocuments();
    }
  });
  
  const observeTarget = document.body || document.documentElement;
  if (observeTarget) {
    observer.observe(observeTarget, {
      childList: true,
      subtree: true,
    });
  }
  
  // Пробуем наблюдать за родительским документом
  try {
    if (window.parent?.document?.body) {
      const parentObserver = new MutationObserver(() => {
        try {
          removeBannersFromDocument(window.parent.document);
        } catch (e) {}
      });
      parentObserver.observe(window.parent.document.body, {
        childList: true,
        subtree: true,
      });
    }
  } catch (e) {}
  
  console.log('[BannerProtection] Protection active.');
}

/**
 * Остановка защиты (не используется)
 */
export function stopBannerProtection(): void {
  // Защита никогда не останавливается
}

/**
 * Инициализация при загрузке
 */
export function cleanOnLoad(): void {
  startBannerProtection();
}

export default {
  start: startBannerProtection,
  stop: stopBannerProtection,
  clean: cleanAllDocuments,
  init: cleanOnLoad
};
