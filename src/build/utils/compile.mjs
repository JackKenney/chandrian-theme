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

            const colors = this.loadColors(scheme);

            base.colors = this.fillTemplateAsObject(
                colors, paths.GENERAL_STYLES_FOLDER);

            base.tokenColors = this.fillTemplateAsArray(
                colors, paths.CODE_STYLES_FOLDER);

            const outputFileName = this.outputFileName(scheme);
            this.writeOutputFile(
                base, paths.VSCODE_OUTPUT_PATH, outputFileName, "json");
        });
    };

    compileIDEA = () => {
        this.colorSchemeFiles.forEach((fileName) => {
            const scheme = this.parseColorScheme(fileName);

            const themeJSON = {
                name: `${scheme.name} Chandrian`,
                dark: scheme.type === "dark",
                author: "JackKenney",
                editorScheme: "",
                colors: {},
                ui: {}
            };

            const colors = this.loadColors(scheme);
            colors["themeName"] = "#" + themeJSON["name"];

            const editorXML = this.replaceXMLTemplateContents(
                `${paths.IDEA_TEMPLATES}/editor/solarized-chandrian.xml`, colors);

            const themeBase = this.parseJSONContents(
                `${paths.IDEA_TEMPLATES}/solarized-chandrian.theme.json`, colors);

            const themeFilePrefix = this.outputFileName(scheme);
            const xmlFilename = this.writeOutputFile(
                editorXML, `${paths.IDEA_OUTPUT_PATH}/editor`,
                themeFilePrefix, "xml", false);

            themeJSON["editorScheme"] = `/editor/${xmlFilename}`;
            themeJSON["colors"] = themeBase["colors"];
            themeJSON["ui"] = themeBase["ui"];

            this.writeOutputFile(
                themeJSON, paths.IDEA_OUTPUT_PATH, themeFilePrefix, "theme.json");
        });
    };

    compileITerm2 = () => {
        this.colorSchemeFiles.forEach((fileName) => {
            const scheme = this.parseColorScheme(fileName);
            const colors = this.loadColors(scheme);

            const themeName = `${scheme.name} Chandrian`;
            const plist = this.replacePlistTemplateContents(
                `${paths.ITERM2_TEMPLATES}/solarized-chandrian.itermcolors`,
                colors, themeName
            );

            this.writeOutputFile(
                plist, paths.ITERM2_OUTPUT_PATH, themeName, "itermcolors", false);
        });
    }

    loadColors = (scheme) => {
        const preTemplateColors = scheme.colors;
        const filledInScheme = this.parseJSONTemplateString(
            JSON.stringify(preTemplateColors), this.solarizedColors);
        const colors = this.addColoredBackgroundsToScheme(filledInScheme);
        return this.addSymbolColorsToScheme(colors);
    }

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
        const template = Object.assign(colorsNoHash, injections);

        return templateXML(contents, template);
    }

    replacePlistTemplateContents = (fileName, colors, themeName) => {
        const plistTemplate = fs.readFileSync(fileName, "utf8");
        const injections = (new XMLInjector()).iterm2Injections(colors);
        injections["themeName"] = themeName;

        return templateXML(plistTemplate, injections);
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
            accum[key] = this.mixColors(bottom, top, 0.20); // TODO: fine tune this
            return accum;
        }, {});

        extraColors["selectionBackground"] = this.mixColors(
            scheme["backgroundMostIntense"],
            scheme["violet"],
            0.15
        );

        extraColors["injectionBackground"] = this.mixColors(
            scheme["backgroundMostIntense"],
            scheme["green"],
            0.05
        );

        return Object.assign(scheme, extraColors);
    }

    /** affords unified schemes across ides */
    addSymbolColorsToScheme = (scheme) => {
        const joiner = {
            attributes: scheme.violet,  // grayish purple
            booleans: scheme.magenta,
            class: scheme.violet,
            commentGray: scheme.gray,
            commentGrayProminent: scheme.gray,
            constant: scheme.magenta,
            decoration: scheme.magenta,
            deprecated: scheme.textMild,
            entity: scheme.blue,
            exit: scheme.orange, // return, throw
            escape: scheme.yellow,
            external: scheme.violet,
            functions: scheme.blue,  // doers
            function: scheme.blue,  // doers
            global: scheme.violet,
            hint: scheme.violet,
            injection: scheme.injectionBackground,
            interfaces: scheme.violet,  //class names, Promise., bright cyan
            interpolated: scheme.yellow,
            interpolation: scheme.yellow,
            key: scheme.cyan,
            keys: scheme.cyan,  //this.state.foo, json keys, bright purple
            keywordGray: scheme.gray,
            macros: scheme.violet, // @gen, async
            mainAlt: scheme.violet,
            mainMild: scheme.cyan,
            member: scheme.cyan,
            metadata: scheme.violet,
            number: scheme.violet,
            parenthesis: scheme.blue,
            punctuation_important: scheme.textMostIntense,
            punctuation_unimportant: scheme.textMild,
            regex: scheme.yellow,
            search: scheme.yellow,
            structural: scheme.yellow,  // if/then
            string: scheme.green,
            strings: scheme.green,
            subtypes: scheme.violet,  // brown-ish red, types, annotation, Type
            types: scheme.violet, // brown-ish red, types, annotation, Type
            type: scheme.violet,
            value: scheme.green,
            tag: scheme.cyan,
            important: scheme.orange,
            variable: scheme.textIntense,
            warn: scheme.yellow,
        }

        return Object.assign(scheme, joiner);
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