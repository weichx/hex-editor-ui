import {StylePropertySet} from "../rendering/style/style_property_set";
import {parseUnitValue} from "./parse_functions";
import {UnitType} from "../unit";

const unitValueContainer : { value : number, unit : UnitType } = {
    value: 0,
    unit: null
};

function parseUnitValueStyle(target : StylePropertySet, styleName : string, input : string, idx = 0) : integer {
    try {
        idx = parseUnitValue(input, idx, unitValueContainer);
        target[styleName] = unitValueContainer.value;
        target[styleName + "Unit"] = unitValueContainer.unit;
    }
    catch (e) {
        console.warn("Unable to parse style [" + styleName + "] from input: " + input);
    }
    return idx;
}

export class StyleParser {

    public static parseStyle(target : StylePropertySet, styleName : string, input : string) : void {
        StyleParsers[styleName](target, input, 0);
    }

}

export const StyleParsers : any = {

    padding: function (target : StylePropertySet, input : string, idx = 0) : integer {
        idx = parseUnitValueStyle(target, "paddingTop", input, idx);
        idx = parseUnitValueStyle(target, "paddingRight", input, idx);
        idx = parseUnitValueStyle(target, "paddingBottom", input, idx);
        idx = parseUnitValueStyle(target, "paddingLeft", input, idx);
        return idx;
    },
    paddingLeftRight: function (target : StylePropertySet, input : string, idx = 0) : integer {
        idx = parseUnitValueStyle(target, "paddingLeft", input, idx);
        idx = parseUnitValueStyle(target, "paddingRight", input, idx);
        return idx;
    },
    paddingTopBottom: function (target : StylePropertySet, input : string, idx = 0) : integer {
        idx = parseUnitValueStyle(target, "paddingTop", input, idx);
        idx = parseUnitValueStyle(target, "paddingBottom", input, idx);
        return idx;
    },
    paddingLeft: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "paddingLeft", input, idx);
    },
    paddingRight: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "paddingRight", input, idx);
    },
    paddingTop: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "paddingTop", input, idx);
    },
    paddingBottom: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "paddingBottom", input, idx);
    },
    borderRadiusTopLeft: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "borderRadiusTopLeft", input, idx);
    },
    borderRadiusTopRight: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "borderRadiusTopRight", input, idx);
    },
    borderRadiusBottomLeft: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "borderRadiusBottomLeft", input, idx);
    },
    borderRadiusBottomRight: function (target : StylePropertySet, input : string, idx = 0) : integer {
        return parseUnitValueStyle(target, "borderRadiusBottomRight", input, idx);
    },
    borderRadiusTop: function (target : StylePropertySet, input : string, idx = 0) : integer {
        idx = parseUnitValueStyle(target, "borderRadiusTopLeft", input, idx);
        idx = parseUnitValueStyle(target, "borderRadiusTopRight", input, idx);
        return idx;
    },
    borderRadiusBottom: function (target : StylePropertySet, input : string, idx = 0) : integer {
        idx = parseUnitValueStyle(target, "borderRadiusBottomLeft", input, idx);
        idx = parseUnitValueStyle(target, "borderRadiusBottomRight", input, idx);
        return idx;
    },
    borderRadiusLeft: function (target : StylePropertySet, input : string, idx = 0) : integer {
        idx = parseUnitValueStyle(target, "borderRadiusTopLeft", input, idx);
        idx = parseUnitValueStyle(target, "borderRadiusBottomLeft", input, idx);
        return idx;
    },
    borderRadiusRight: function (target : StylePropertySet, input : string, idx = 0) : integer {
        idx = parseUnitValueStyle(target, "borderRadiusTopRight", input, idx);
        idx = parseUnitValueStyle(target, "borderRadiusBottomRight", input, idx);
        return idx;
    },
};
