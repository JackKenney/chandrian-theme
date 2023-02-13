/**
    EFFECT_TYPE
        none but color present = bordered
        1 = underscored
        2 = under-waved
        4 = bold underscored
        5 = strikeout
        6 = dotted line

    FONT_TYPE
        1 = bold
        2 = italic
        3 = bold and italic

    <option name="FOREGROUND" value="{}" />
    <option name="BACKGROUND" value="{}" />
    <option name="EFFECT_TYPE" value="" />
    <option name="EFFECT_COLOR" value="{}" />
    <option name="ERROR_STRIPE_COLOR" value="{}" />
    <option name="FONT_TYPE" value="" />
*/
export default class XMLInjector {
    getInjectionXMLTemplates() {
        const template = {
            bad: `
                <option name="FOREGROUND" value="{red}"/>
                <option name="EFFECT_COLOR" value="{redBackground}"/>
                <option name="EFFECT_TYPE" value="2" /> <!-- underwave -->
            `,

            bold: `
                <option name="FONT_TYPE" value="1"/>
            `,

            bold_italic: `
                <option name="FONT_TYPE" value="3"/>
            `,

            class: `
                <option name="FOREGROUND" value="{violet}"/>
            `,

            comment: `
                <option name="FOREGROUND" value="{commentGray}"/>
                <option name="FONT_TYPE" value="2"/>
            `,

            constant: `
                <option name="FOREGROUND" value="{magenta}"/>
                <option name="FONT_TYPE" value="2"/>
            `,

            decoration: `
                <option name="FOREGROUND" value="{magenta}"/>
                <option name="FONT_TYPE" value="2"/>
            `,

            default: `
                <option name="FOREGROUND" value="{text}"/>
                <option name="BACKGROUND" value="{backgroundMostIntense}"/>
            `,

            deprecated: `
                <option name="EFFECT_COLOR" value="{textMild}"/>
                <option name="EFFECT_TYPE" value="3"/>
            `,

            entity: `
                <option name="FOREGROUND" value="{blue}"/>
            `,

            error: `
                <option name="EFFECT_COLOR" value="{red}"/>
                <option name="EFFECT_TYPE" value="2" /> <!-- underwave -->
            `,

            expensive: `
                <option name="EFFECT_COLOR" value="{red}"/>
                <option name="EFFECT_TYPE" value="1"/>
            `,

            external: `
                <option name="FOREGROUND" value="{violet}"/>
            `,

            followed: `
                <option name="FOREGROUND" value="{violet}"/>
                <option name="FONT_TYPE" value="2"/>
                <option name="EFFECT_COLOR" value="{violet}"/>
                <option name="EFFECT_TYPE" value="1"/>
            `,

            function: `
                <option name="FOREGROUND" value="{blue}"/>
            `,

            global: `
                <option name="FOREGROUND" value="{violet}"/>
                <option name="FONT_TYPE" value="2"/>
            `,

            hint: `
                <option name="FOREGROUND" value="{violet}"/>
                <option name="BACKGROUND" value="{background}"/>
            `,

            important: `
                <option name="FOREGROUND" value="{orange}"/>
                <option name="BACKGROUND" value="{backgroundIntense}"/>
            `,

            injection: `
                <option name="EFFECT_COLOR" value="{green}"/>
            `,

            interpolation: `
                <option name="FOREGROUND" value="{yellow}"/>
            `,

            italic: `
                <option name="FONT_TYPE" value="2"/>
            `,

            key: `
                <option name="FOREGROUND" value="{cyan}"/>
            `,

            link: `
                <option name="FOREGROUND" value="{blue}"/>
                <option name="EFFECT_COLOR" value="{blue}"/>
                <option name="EFFECT_TYPE" value="1"/>
            `,

            member: `
                <option name="FOREGROUND" value="{cyan}"/>
            `,

            metadata: `
                <option name="FOREGROUND" value="{violet}"/>
            `,

            parenthesis: `
                <option name="FOREGROUND" value="{blue}"/>
            `,

            punctuation_important: `
                <option name="FOREGROUND" value="{textMostIntense}"/>
            `,

            punctuation_unimportant: `
                <option name="FOREGROUND" value="{textMild}"/>
            `,

            red: `
                <option name="FOREGROUND" value="{red}"/>
            `,

            search: `
                <option name="BACKGROUND" value="{background}"/>
                <option name="EFFECT_COLOR" value="{yellow}"/>
                <option name="ERROR_STRIPE_COLOR" value="{yellow}"/>
            `,

            string: `
                <option name="FOREGROUND" value="{green}"/>
            `,

            structure: `
                <option name="FOREGROUND" value="{yellow}"/>
            `,

            tag: `
                <option name="FOREGROUND" value="{cyan}"/>
            `,

            template: `
                <option name="BACKGROUND" value="{backgroundIntense}"/>
                <option name="EFFECT_COLOR" value="{violet}"/>
            `,

            unknown: `
                <option name="FOREGROUND" value="{commentGray}"/>
                <option name="EFFECT_COLOR" value="{commentGray}"/>
                <option name="EFFECT_TYPE" value="5"/>
            `,

            value: `
                <option name="FOREGROUND" value="{green}"/>
            `,

            variable: `
                <option name="FOREGROUND" value="{textIntense}"/>
            `,

            warn: `
                <option name="EFFECT_COLOR" value="{yellowBackground}"/>
                <option name="ERROR_STRIPE_COLOR" value="{yellow}"/>
                <option name="EFFECT_TYPE" value="2"/>
            `,

            // levels

            level_0: `
                <option name="FOREGROUND" value="{blue}"/>
            `,
            level_1: `
                <option name="FOREGROUND" value="{orange}"/>
            `,
            level_2: `
                <option name="FOREGROUND" value="{cyan}"/>
            `,
            level_3: `
                <option name="FOREGROUND" value="{violet}"/>
            `,
            level_4: `
                <option name="FOREGROUND" value="{yellow}"/>
            `,
            level_5: `
                <option name="FOREGROUND" value="{magenta}"/>
            `,
            level_6: `
                <option name="FOREGROUND" value="{green}"/>
            `,
            level_7: `
                <option name="FOREGROUND" value="{red}"/>
            `,
            level_8: `
                <option name="FOREGROUND" value="{blue}"/>
            `,
            level_9: `
                <option name="FOREGROUND" value="{orange}"/>
            `,
        };

        // duplicates to facilitate future complications

        template["angle"] = template["default"];
        template["attribute"] = template["key"];
        template["constructor"] = template["function"];
        template["comma"] = template["punctuation_important"];
        template["colon"] = template["structure"];
        template["curly"] = template["structure"];
        template["dot"] = template["punctuation_important"];
        template["enum"] = template["constant"];
        template["escape"] = template["interpolation"];
        template["field"] = template["member"];
        template["getter"] = template["function"];
        template["identifier"] = template["entity"];
        template["interface"] = template["entity"];
        template["invalid"] = template["bad"];
        template["keyword"] = template["structure"];
        template["label"] = template["tag"];
        template["library"] = template["external"];
        template["method"] = template["function"];
        template["macro"] = template["global"];
        template["scalar"] = template["constant"];
        template["object"] = template["class"];
        template["operator"] = template["structure"];
        template["overloaded"] = template["macro"];
        template["package"] = template["library"];
        template["parameter"] = template["variable"];
        template["semicolon"] = template["punctuation_unimportant"];
        template["separator"] = template["comma"];
        template["setter"] = template["function"];
        template["square"] = template["parenthesis"];
        template["symbol"] = template["global"];
        template["trait"] = template["metadata"];
        template["type"] = template["metadata"];

        return template;
    }
}