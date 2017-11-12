import * as ParseUtil from "./parse_util";
import {UnitType} from "../unit";

const isNumber = ParseUtil.isNumber;
const isWhiteSpace = ParseUtil.isWhiteSpace;
const isUnit = ParseUtil.isUnit;
const isUnitPart = ParseUtil.isUnitPart;

export function parseNumber(input : string, idx : integer, out : { value : number }) : integer {
    var length = input.length;
    var startIdx = idx;
    while (isNumber(input[idx]) && idx < length) {
        idx++;
    }
    var value = +(input.substring(startIdx, idx));
    if (isNaN(value)) {
        throw new Error("Unable to parse number from input " + input.substring(startIdx, idx));
    }
    else {
        out.value = value;
    }
    return idx;
}

export function parseUnitValue(input : string, idx : integer, out : { value : integer, unit : UnitType }) : integer {
    idx = eatWhitespace(input, idx);
    idx = parseNumber(input, idx, out);
    idx = parseUnit(input, idx, out);
    return idx;
}

export function parseUnit(input : string, idx : integer, out : { unit : UnitType }) : integer {
    var length = input.length;
    idx = eatWhitespace(input, idx);
    var startIdx = idx;
    while (idx < length && isUnitPart(input[idx])) {
        idx++;
    }
    if(idx === startIdx) {
        out.unit = UnitType.Pixel;
        return idx;
    }
    var str = input.substring(startIdx, idx);
    if (isUnit(str)) {
        out.unit = mapUnitType(str);
    }
    return idx;
}

export function eatWhitespace(input : string, idx : integer) : integer {
    while (isWhiteSpace(input[idx])) idx++;
    return idx;
}

function mapUnitType(unitString : string) {
    switch(unitString) {
        case "px": return UnitType.Pixel;
        case "%" : return UnitType.Percent;
        case "em" : return UnitType.Em;
    }
    return UnitType.Pixel;
}