import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT = path.resolve(__dirname, '../../..');
export const SRC = path.resolve(__dirname, '../..');
export const SOLARIZED_PALETTE = path.resolve(SRC, 'solarized-palette.jsonc');
export const COLOR_SCHEMES_FOLDER = `${SRC}/color-schemes`;
export const VSCODE_TEMPLATES = `${SRC}/templates-code`;
export const IDEA_TEMPLATES = `${SRC}/templates-idea`;
export const ITERM2_TEMPLATES = `${SRC}/templates-iterm2`;
export const GENERAL_STYLES_FOLDER = `${VSCODE_TEMPLATES}/editor-colors`;
export const CODE_STYLES_FOLDER = `${VSCODE_TEMPLATES}/token-colors`;
export const VSCODE_OUTPUT_PATH = path.resolve(ROOT, 'dist', 'code');
export const IDEA_OUTPUT_PATH = path.resolve(ROOT, 'dist', 'idea');
export const ITERM2_OUTPUT_PATH = path.resolve(ROOT, 'dist', 'iterm2');
