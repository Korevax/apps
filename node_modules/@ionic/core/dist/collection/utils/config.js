/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
export const setupConfig = (config) => {
    const win = window;
    const Ionic = win.Ionic;
    if (Ionic && Ionic.config && Ionic.config.constructor.name !== 'Object') {
        return;
    }
    win.Ionic = win.Ionic || {};
    win.Ionic.config = {
        ...win.Ionic.config,
        ...config,
    };
    return win.Ionic.config;
};
export const getMode = () => {
    const win = window;
    const config = win?.Ionic?.config;
    if (config) {
        if (config.mode) {
            return config.mode;
        }
        else {
            return config.get('mode');
        }
    }
    return 'md';
};
export const ENABLE_HTML_CONTENT_DEFAULT = false;
