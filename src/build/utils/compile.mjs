import fs from "fs";
import jsonc from "jsonc-parser";
import templateJSON from "json-templates";
import templateXML from "string-template";

import * as paths from "./paths.mjs";
import XMLInjector from "./injection.mjs";

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
            const filledInScheme = this.parseJSONTemplateString(
                JSON.stringify(preTemplateColors), this.solarizedColors);
            const colors = this.addColoredBackgroundsToScheme(filledInScheme);

            const generalColors = this.fillTemplateAsObject(
                colors, paths.GENERAL_STYLES_FOLDER);
            base.colors = generalColors;

            const codeColors = this.fillTemplateAsArray(
                colors, paths.CODE_STYLES_FOLDER);
            base.tokenColors = codeColors;

            const outputFileName = this.outputFileName(scheme);
            this.writeOutputFile(
                base, paths.VSCODE_OUTPUT_PATH, outputFileName, "json");
        });
        console.log("Build complete.");
    };

    compileIDEA = () => {
        this.colorSchemeFiles.forEach((fileName) => {
            const scheme = this.parseColorScheme(fileName);

            const themeJSON = {
                name: `${scheme.name} Chandrian`,
                dark: scheme.type == "dark",
                author: "JackKenney",
                editorScheme: "",
                colors: {},
                ui: {}
            };

            const preTemplateColors = scheme.colors;
            const filledInScheme = this.parseJSONTemplateString(
                JSON.stringify(preTemplateColors), this.solarizedColors);
            const colors = this.addColoredBackgroundsToScheme(filledInScheme);

            const colorsAndName = colors;
            colorsAndName["themeName"] = "#" + themeJSON["name"];

            const editorXML = this.replaceXMLTemplateContents(
                `${paths.IDEA_TEMPLATES}/editor/solarized-chandrian.xml`, colors);

            const themeBase = this.parseJSONContents(
                `${paths.IDEA_TEMPLATES}/solarized-chandrian.theme.json`, colors);

            const themeFilePrefix = this.outputFileName(scheme);
            const xmlFilename = this.writeOutputFile(
                editorXML, `${paths.IDEA_OUTPUT_PATH}/editor`, themeFilePrefix, "xml", false);

            themeJSON["editorScheme"] = `/editor/${xmlFilename}`;
            themeJSON["colors"] = themeBase["colors"];
            themeJSON["ui"] = themeBase["ui"];

            this.writeOutputFile(
                themeJSON, paths.IDEA_OUTPUT_PATH, themeFilePrefix, "theme.json");
        });
        console.log("Build complete.");
    };

    parseColors = () => {
        const solarizedContents = fs.readFileSync(
            paths.SOLARIZED_PALETTE, "utf8"
        );
        return jsonc.parse(solarizedContents);
    }
    parseJSONContents = (fileName, colors) => {
        const contents = fs.readFileSync(fileName, "utf8");
        return this.parseJSONTemplateString(contents, colors);
    }
    parseJSONTemplateString = (preimage, colors) => {
        const templated = templateJSON(preimage)(colors);
        return jsonc.parse(templated);
    }

    /** NOTE: Strips the # off each value (only pass hex colors) */
    replaceXMLTemplateContents = (fileName, hexColors) => {
        const contents = fs.readFileSync(fileName, "utf8");

        const colorsNoHash = {};
        Object.keys(hexColors).map((key) => {
            colorsNoHash[key] = hexColors[key].substr(1);
        });

        const injections = (new XMLInjector()).getInjectionXMLTemplates();
        Object.keys(injections).map((key) => {
            injections[key] = templateXML(injections[key], colorsNoHash);
        });

        // combine templates to do one round of templating
        const template = Object.assign(injections, colorsNoHash);

        return templateXML(contents, template);
    }

    parseColorScheme = (fileName) => {
        const contents = fs.readFileSync(
            `${paths.COLOR_SCHEMES_FOLDER}/${fileName}`, "utf8"
        );
        return jsonc.parse(contents);
    }

    addColoredBackgroundsToScheme = (scheme) => {
        const basicColorNames = ["yellow", "orange", "red", "magenta",
            "violet", "blue", "cyan", "green"];

        const extraColors = basicColorNames.reduce((accum, colorName) => {
            const bottom = scheme["backgroundMostIntense"];
            const top = scheme[colorName];
            const key = colorName + "Background";
            accum[key] = this.mixColors(bottom, top, 0.33);
            return accum;
        }, {});

        extraColors["selectionBackground"] = this.mixColors(
            scheme["backgroundMostIntense"],
            scheme["violet"],
            0.15
        );

        return Object.assign(scheme, extraColors);
    }

    mixColors = (bottom, top, alpha) => {
        const starts = [1, 3, 5]; // skip hashtag
        const color = starts.reduce((string, start) =>
            string + Math.floor((
                parseInt(bottom.substr(start, 2), 16) * (1 - alpha) +
                parseInt(top.substr(start, 2), 16) * alpha
            )).toString(16), "");
        return "#" + color;
    }

    fillTemplateAsObject = (colors, folder) => {
        const files = fs.readdirSync(folder);
        return files.reduce((accum, fileName) => {
            const contents = this.parseJSONContents(
                `${folder}/${fileName}`,
                colors
            );
            Object.assign(accum, contents);
            return accum;
        }, {});
    }
    fillTemplateAsArray = (colors, folder) => {
        const files = fs.readdirSync(folder);
        return files.reduce((accum, fileName) => {
            const contents = this.parseJSONContents(
                `${folder}/${fileName}`,
                colors
            );
            accum = accum.concat(contents);
            return accum;
        }, []);
    }

    outputFileName = (scheme) => (
        `${scheme.name.toLowerCase().replace(" ", "-")}-chandrian`
    )

    /** Returns the final output filename.extension */
    writeOutputFile = (contents, path, fileName, ext, stringify = true) => {
        fileName = `${fileName}.${ext}`;
        const outputFile = `${path}/${fileName}`;

        if (stringify)
            fs.writeFile(
                outputFile, JSON.stringify(contents, null, 2), "utf8", () => { }
            );
        else
            fs.writeFile(outputFile, contents, "utf8", () => { });

        console.log("Writing", outputFile);
        return fileName;
    }
}