/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const setupConfig = (config) => {
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
const getMode = () => {
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
const ENABLE_HTML_CONTENT_DEFAULT = false;

export { ENABLE_HTML_CONTENT_DEFAULT as E, getMode as g, setupConfig as s };
