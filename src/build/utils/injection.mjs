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
    // FONTS
    BOLD = "1"
    ITALICS = "2"
    BOLD_ITALIC = "3"
    // EFFECTS
    BORDERED = null
    UNDERSCORE = "1"
    UNDERWAVE = "2"
    BOLD_UNDERSCORED = "4"
    STRIKEOUT = "5"
    DOTTED_LINE = "6"

    foreground = (key) => (`
                <option name="FOREGROUND" value="{${key}}"/>
            `)

    background = (key) => (`
            <option name="BACKGROUND" value="{${key}}"/>
    `)

    effectColor = (key) => (`
            <option name="EFFECT_COLOR" value="{${key}}"/>
    `)

    effectType = (value) => (value ? `
            <option name="EFFECT_TYPE" value="${value}" />
    ` : "")

    fontType = (value) => (`
                <option name="FONT_TYPE" value="${value}"/>
            `)

    errorStripe = (value) => (`
                <option name="ERROR_STRIPE_COLOR" value="{${value}}"/>
    `)

    getInjectionXMLTemplates() {
        const template = {
            bad: this.foreground("red") +
                this.effectColor("redBackground") +
                this.effectType(this.UNDERWAVE),

            bold: this.fontType(this.BOLD),

            bold_italic: this.fontType(this.BOLD_ITALIC),

            class: this.foreground("class"),

            comment: this.foreground("commentGray") +
                this.fontType(this.ITALICS),

            constant: this.foreground("constant"),

            decoration: this.foreground("decoration") +
                this.fontType(this.ITALICS),

            default: this.foreground("text") +
                this.background("backgroundMostIntense"),

            deprecated: this.effectColor("deprecated") +
                this.effectType(this.BOLD_ITALIC),

            entity: this.foreground("blue"),

            error: this.effectColor("red") +
                this.effectType(this.UNDERWAVE),

            expensive: this.foreground("red") +
                this.effectColor("red") +
                this.effectType(this.UNDERSCORE),

            external: this.foreground("external"),

            followed: this.foreground("violet") +
                this.fontType(this.ITALICS) +
                this.effectColor("violet") +
                this.effectType(this.UNDERSCORE),

            function: this.foreground("function"),

            global: this.foreground("global") +
                this.fontType(this.ITALICS),

            hint: this.foreground("hint") +
                this.background("background"),

            important: this.foreground("important") +
                this.background("backgroundIntense"),

            injection: this.background("injection"),

            interpolation: this.foreground("interpolation"),

            italic: this.fontType(this.ITALICS),

            key: this.foreground("key"),

            link: this.foreground("blue") +
                this.effectColor("blue") +
                this.effectType(this.UNDERSCORE),

            member: this.foreground("member"),

            metadata: this.foreground("metadata"),

            parenthesis: this.foreground("parenthesis"),

            punctuation_important: this.foreground("punctuation_important"),

            punctuation_unimportant: this.foreground("punctuation_unimportant"),

            search: this.background("background") +
                this.effectColor("search") +
                this.errorStripe("search"),

            string: this.foreground("string"),

            structure: this.foreground("structural"),

            tag: this.foreground("tag"),

            template: this.background("backgroundIntense") +
                this.effectColor("violet"),

            unknown: this.foreground("commentGray") +
                this.effectColor("commentGray") +
                this.effectType(this.STRIKEOUT),

            value: this.foreground("value"),

            variable: this.foreground("variable"),

            warn: this.errorStripe("warn") +
                this.effectColor("warn") +
                this.effectType(this.UNDERWAVE),

            // levels
            level_0: this.foreground("blue"),
            level_1: this.foreground("orange"),
            level_2: this.foreground("cyan"),
            level_3: this.foreground("violet"),
            level_4: this.foreground("yellow"),
            level_5: this.foreground("magenta"),
            level_6: this.foreground("green"),
            level_7: this.foreground("red"),
            level_8: this.foreground("blue"),
            level_9: this.foreground("orange"),
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
        template["strings"] = template["string"];
        template["symbol"] = template["global"];
        template["trait"] = template["metadata"];
        template["type"] = template["metadata"];

        return template;
    }
}