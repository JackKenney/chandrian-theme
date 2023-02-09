export default class XMLInjector {
    /*
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


    <option name="">
        <value>
        <option name="FOREGROUND" value="{}" />
        <option name="BACKGROUND" value="{}" />
        <option name="EFFECT_TYPE" value="" />
        <option name="EFFECT_COLOR" value="{}" />
        <option name="ERROR_STRIPE_COLOR" value="{}" />
        <option name="FONT_TYPE" value="" />
        </value>
    </option>
    */
    getInjectionXMLTemplates() {
        const template = {
            bad: `<value>
                <option name="FOREGROUND" value="{red}"/>
                <option name="EFFECT_COLOR" value="{redBackground}"/>
                <option name="EFFECT_TYPE" value="2" /> <!-- underwave -->
            </value>`,

            comment: `<value>
                <option name="FOREGROUND" value="{commentGray}"/>
                <option name="FONT_TYPE" value="2"/>
            </value>`,

            constant: `<value>
                <option name="FOREGROUND" value="{magenta}"/>
                <option name="FONT_TYPE" value="2"/>
            </value>`,

            decoration: `<value>
                <option name="FOREGROUND" value="{magenta}"/>
                <option name="FONT_TYPE" value="2"/>
            </value>`,

            default: `<value>
                <option name="FOREGROUND" value="{text}"/>
                <option name="BACKGROUND" value="{backgroundMostIntense}"/>
            </value>`,

            deprecated: `<value>
                <option name="EFFECT_COLOR" value="{textMild}"/>
                <option name="EFFECT_TYPE" value="3"/>
            </value>`,

            entity: `<value>
                <option name="FOREGROUND" value="{blue}"/>
            </value>`,

            expensive: `<value>
                <option name="EFFECT_COLOR" value="{red}"/>
                <option name="EFFECT_TYPE" value="1"/>
            </value>`,

            external: `<value>
                <option name="FOREGROUND" value="{violet}"/>
            </value>`,

            followed: `<value>
                <option name="FOREGROUND" value="{violet}"/>
                <option name="FONT_TYPE" value="2"/>
                <option name="EFFECT_COLOR" value="{violet}"/>
                <option name="EFFECT_TYPE" value="1"/>
            </value>`,

            function: `<value>
                <option name="FOREGROUND" value="{magenta}"/>
                </value>`,

            global: `<value>
                <option name="FOREGROUND" value="{orange}"/>
                <option name="FONT_TYPE" value="2"/>
                </value>`,

            hint: `<value>
                <option name="FOREGROUND" value="{violet}"/>
                <option name="BACKGROUND" value="{background}"/>
            </value>`,

            important: `<value>
                <option name="FOREGROUND" value="{red}"/>
                <option name="BACKGROUND" value="{backgroundIntense}"/>
            </value>`,

            injection: `<value>
                    <option name="EFFECT_COLOR" value="{green}"/>
                </value>`,

            interpolation: `<value>
                <option name="FOREGROUND" value="{yellow}"/>
            </value>`,

            key: `<value>
                <option name="FOREGROUND" value="{cyan}"/>
            </value>`,

            link: `<value>
                <option name="FOREGROUND" value="{blue}"/>
                <option name="EFFECT_COLOR" value="{blue}"/>
                <option name="EFFECT_TYPE" value="1"/>
            </value>`,

            member: `<value>
                <option name="FOREGROUND" value="{blue}"/>
            </value>`,

            metadata: `<value>
                <option name="FOREGROUND" value="{violet}"/>
            </value>`,

            parenthesis: `<value>
                <option name="FOREGROUND" value="{blue}"/>
            </value>`,

            punctuation_important: `<value>
                <option name="FOREGROUND" value="{textMostIntense}"/>
            </value>`,

            punctuation_unimportant: `<value>
                <option name="FOREGROUND" value="{textMild}"/>
            </value>`,

            search: `<value>
                <option name="BACKGROUND" value="{background}"/>
                <option name="EFFECT_TYPE" value="{}" />
                <option name="EFFECT_COLOR" value="{yellow}"/>
                <option name="ERROR_STRIPE_COLOR" value="{yellow}"/>
            </value>`,

            string: `<value>
                <option name="FOREGROUND" value="{green}"/>
            </value>`,

            structure: `<value>
                <option name="FOREGROUND" value="{yellow}"/>
            </value>`,

            tag: `<value>
                <option name="FOREGROUND" value="{cyan}"/>
            </value>`,

            template: `<value>
                <option name="BACKGROUND" value="{backgroundIntense}"/>
                <option name="EFFECT_COLOR" value="{violet}"/>
            </value>`,

            unknown: `<value>
                <option name="FOREGROUND" value="{commentGray}"/>
                <option name="EFFECT_COLOR" value="{commentGray}"/>
                <option name="EFFECT_TYPE" value="5"/>
            </value>`,

            value: `<value>
                <option name="FOREGROUND" value="{green}"/>
            </value>`,

            variable: `<value>
                <option name="FOREGROUND" value="{cyan}"/>
            </value>`,

            warn: `<value>
                <option name="EFFECT_COLOR" value="{yellowBackground}"/>
                <option name="ERROR_STRIPE_COLOR" value="{yellow}"/>
                <option name="EFFECT_TYPE" value="2"/>
            </value>`,

            // levels

            level_0: `<value>
                <option name="FOREGROUND" value="{blue}"/>
            </value>`,
            level_1: `<value>
                <option name="FOREGROUND" value="{orange}"/>
            </value>`,
            level_2: `<value>
                <option name="FOREGROUND" value="{cyan}"/>
            </value>`,
            level_3: `<value>
                <option name="FOREGROUND" value="{violet}"/>
            </value>`,
            level_4: `<value>
                <option name="FOREGROUND" value="{yellow}"/>
            </value>`,
            level_5: `<value>
                <option name="FOREGROUND" value="{magenta}"/>
            </value>`,
            level_6: `<value>
                <option name="FOREGROUND" value="{green}"/>
            </value>`,
            level_7: `<value>
                <option name="FOREGROUND" value="{red}"/>
            </value>`,
            level_8: `<value>
                <option name="FOREGROUND" value="{blue}"/>
            </value>`,
            level_9: `<value>
                <option name="FOREGROUND" value="{orange}"/>
            </value>`,
        };

        // duplicates to facilitate future complications

        template["attribute"] = template["key"];
        template["class"] = template["entity"];
        template["constructor"] = template["function"];
        template["comma"] = template["punctuation_important"];
        template["colon"] = template["structure"];
        template["curly"] = template["structure"];
        template["dot"] = template["punctuation_important"];
        template["enum"] = template["constant"];
        template["escape"] = template["interpolation"];
        template["field"] = template["member"];
        template["getter"] = template["function"];
        template["interface"] = template["entity"];
        template["invalid"] = template["bad"];
        template["keyword"] = template["structure"];
        template["method"] = template["function"];
        template["macro"] = template["global"];
        template["scalar"] = template["constant"];
        template["object"] = template["class"];
        template["operator"] = template["structure"];
        template["overloaded"] = template["macro"];
        template["parameter"] = template["variable"];
        template["semicolon"] = template["punctuation_unimportant"];
        template["separator"] = template["comma"];
        template["setter"] = template["function"];
        template["square"] = template["parenthesis"];
        template["trait"] = template["metadata"];
        template["type"] = template["metadata"];

        return template;
    }
}