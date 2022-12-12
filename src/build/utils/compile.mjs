import fs from "fs";
import jsonc from "jsonc-parser";
import template from "json-templates";
import * as paths from "./paths.mjs";

export default class Compiler {
    constructor() {
        this.solarizedColors = this.parseColors();
        this.colorSchemeFiles = fs.readdirSync(paths.COLOR_SCHEMES_FOLDER);
    }

    compileVSCode = () => {
        this.colorSchemeFiles.forEach((fileName) => {
            const scheme = this.parseColorScheme(fileName);

            const base = {
                name: `${scheme.name} Chandrian`,
                type: scheme.type,
                colors: {},
                tokenColors: [],
            };

            const preTemplateColors = scheme.colors;
            const colors = this.parseTemplateString(
                JSON.stringify(preTemplateColors), this.solarizedColors);

            const generalColors = this.parseAndTemplateAsObject(
                colors, paths.GENERAL_STYLES_FOLDER);
            base.colors = generalColors;

            const codeColors = this.parseAndTemplateAsArray(
                colors, paths.CODE_STYLES_FOLDER);
            base.tokenColors = codeColors;

            const outputFileName = `${scheme.name.toLowerCase().replace(" ", "-")}-chandrian`;
            this.writeOutputFile(outputFileName, paths.VSCODE_OUTPUT_PATH, base);
        });
        console.log("Build complete.");
    };

    compileIDEA = () => {
        this.colorSchemeFiles.forEach((fileName) => {
            const scheme = this.parseColorScheme(fileName);

            const themeJSON = {
                name: `${scheme.name} Chandrian`,
                dark: scheme.type == "dark",
                // todo add more fields
            };

            const preTemplateColors = scheme.colors;
            const colors = this.parseTemplateString(JSON.stringify(preTemplateColors), this.solarizedColors);

            console.log(`IDEA base: ${JSON.stringify(themeJSON)}`);

        });
        console.log("Build complete.");
    };

    parseColors = () => {
        const solarizedContents = fs.readFileSync(
            paths.SOLARIZED_PALETTE, "utf8"
        );
        return jsonc.parse(solarizedContents);
    }
    parseContents = (fileName, colors) => {
        const contents = fs.readFileSync(fileName, "utf8");
        return this.parseTemplateString(contents, colors);
    }
    parseTemplateString = (preimage, colors) => {
        const templated = template(preimage)(colors);
        return jsonc.parse(templated);
    }

    parseColorScheme = (fileName) => {
        const contents = fs.readFileSync(
            `${paths.COLOR_SCHEMES_FOLDER}/${fileName}`, "utf8"
        );
        return jsonc.parse(contents);
    }

    parseAndTemplateAsObject = (colors, folder) => {
        const files = fs.readdirSync(folder);
        return files.reduce((accum, fileName) => {
            const contents = this.parseContents(
                `${folder}/${fileName}`,
                colors
            );
            Object.assign(accum, contents);
            return accum;
        }, {});
    }
    parseAndTemplateAsArray = (colors, folder) => {
        const files = fs.readdirSync(folder);
        return files.reduce((accum, fileName) => {
            const contents = this.parseContents(
                `${folder}/${fileName}`,
                colors
            );
            accum = accum.concat(contents);
            return accum;
        }, []);
    }

    writeOutputFile = (fileName, path, base) => {
        const outputFile = `${path}/${fileName}.json`;

        fs.writeFileSync(
            outputFile, JSON.stringify(base, null, 2), "utf8"
        );
        console.log("Writing", outputFile);
    }
}