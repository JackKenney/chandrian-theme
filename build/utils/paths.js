const path = require('path');

const basePath = path.resolve(__dirname, '../../code-themes/');

exports.basePath = basePath;
exports.GENERAL_STYLES_FOLDER = `${basePath}/editor-colors`;
exports.CODE_STYLES_FOLDER = `${basePath}/token-colors`;
exports.COLOR_SCHEMES_FOLDER = `${basePath}/color-schemes`;
exports.OUTPUT_PATH = path.resolve(__dirname, '../../code-dist');
exports.SOLARIZED_PALETTE = path.resolve(__dirname, '../../solarized-palette.jsonc');
