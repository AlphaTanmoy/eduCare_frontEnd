// src/app/utils/bootstrap-loader.ts
export function loadBootstrap(): { css: HTMLLinkElement; js: HTMLScriptElement } {
    // Load Bootstrap CSS dynamically
    const bootstrapCss = document.createElement('link');
    bootstrapCss.rel = 'stylesheet';
    bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCss);

    // Load Bootstrap JS dynamically
    const bootstrapJs = document.createElement('script');
    bootstrapJs.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    bootstrapJs.type = 'text/javascript';
    document.body.appendChild(bootstrapJs);

    return { css: bootstrapCss, js: bootstrapJs };
}

export function removeBootstrap(elements: { css: HTMLLinkElement; js: HTMLScriptElement }): void {
    if (elements.css && document.head.contains(elements.css)) {
        document.head.removeChild(elements.css);
    }
    if (elements.js && document.body.contains(elements.js)) {
        document.body.removeChild(elements.js);
    }
}
