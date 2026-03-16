/**
 * Analytics utility for tracking user behavior in the configurator.
 * Can be extended to use Google Analytics (gtag), Mixpanel, or custom backend.
 */

export const trackEvent = (eventName, params = {}) => {
    // 1. Log to console for debugging
    console.log(`[Analytics] Event: ${eventName}`, params);

    // 2. Integration with Google Analytics (if available)
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }

    // 3. Integration with Facebook Pixel (if available)
    if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', eventName, params);
    }
};

export const ANALYTICS_EVENTS = {
    CONFIGURATOR_START: 'configurator_start',
    STEP_COMPLETE: 'step_complete',
    STEP_BACK: 'step_back',
    FORM_VALIDATION_ERROR: 'form_validation_error',
    WA_CHAT_CLICK: 'wa_chat_click',
    ORDER_SUBMIT_SUCCESS: 'order_submit_success',
    ORDER_SUBMIT_ERROR: 'order_submit_error',
    PDF_DOWNLOAD: 'pdf_download',
};
