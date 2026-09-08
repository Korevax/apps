/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
'use strict';

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

exports.ENABLE_HTML_CONTENT_DEFAULT = ENABLE_HTML_CONTENT_DEFAULT;
exports.getMode = getMode;
exports.setupConfig = setupConfig;
