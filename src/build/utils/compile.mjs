import fs from "fs";
import jsonc from "jsonc-parser";
import template from "json-templates";
import * as paths from "./paths.mjs";

export default class Compiler {
    compileVSCode = () => {
        const solarizedColors = this.parseColors();

        const colorSchemeFiles = fs.readdirSync(paths.COLOR_SCHEMES_FOLDER);

        colorSchemeFiles.forEach((fileName) => {
            const scheme = this.parseColorScheme(fileName);

            const base = {
                name: `${scheme.name} Chandrian`,
                type: scheme.type,
                colors: {},
                tokenColors: [],
            };

            const preTemplateColors = scheme.colors;
            const colors = this.parseTemplateString(JSON.stringify(preTemplateColors), solarizedColors);

            const generalColors = this.parseAndTemplateAsObject(
                colors, paths.GENERAL_STYLES_FOLDER);
            base.colors = generalColors;

            const codeColors = this.parseAndTemplateAsArray(
                colors, paths.CODE_STYLES_FOLDER);
            base.tokenColors = codeColors;

            this.writeOutputFile(scheme.name, paths.VSCODE_OUTPUT_PATH, base);
        });
        console.log("Build complete.");
    };

    compileIDEA = () => {
        console.log("TODO: Implement IDEA variant");
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

    writeOutputFile = (name, path, base) => {
        const outputFileName = `${name.toLowerCase()}-chandrian`;
        const outputFile = `${path}/${outputFileName}.json`;

        fs.writeFileSync(
            outputFile, JSON.stringify(base, null, 2), "utf8"
        );
        console.log("Writing", outputFile);
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
}