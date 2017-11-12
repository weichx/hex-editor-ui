import {StylePropertySet} from "./style_property_set";
import {StyleParsers} from "../../parsing/style_parser";
import {Color} from "../../color";
import {Vector2} from "../../../math/vector2";
import {UnitType, UnitValue} from "../../unit";
import {BackgroundClip, BackgroundImage, BackgroundRepeat, BackgroundScroll} from "../background";
import {Visibility} from "../../e_visibility";
import {OffsetRectangle} from "../../../geometry/offset_rectangle";

type StyleMetaState = "hover" | "disable" | "focus" | "active" | "visited";
type FloatGetter = (stateName : string, metaState? : string) => float;
type FloatSetter = (stateName : string, metaState? : string, value? : float) => void;
type UnitValueGetter = () => UnitValue;
type UnitValueSetter = any;

//note MOST OF THIS FILE DOESN'T WORK RIGHT NOW!!!

var setters : any = {

    padding: function (target : StylePropertySet, value : string|number|OffsetRectangle) {
        if (typeof value === "string") {
            StyleParsers.padding(target, value);
        }
        else if (typeof value === "number") {
            target.paddingTop = value;
            target.paddingRight = value;
            target.paddingBottom = value;
            target.paddingLeft = value;
            target.paddingTopUnit = "px";
            target.paddingRightUnit = "px";
            target.paddingBottomUnit = "px";
            target.paddingLeftUnit = "px";
        }
        else if (value instanceof OffsetRectangle) {
            target.paddingTop = value.top;
            target.paddingRight = value.right;
            target.paddingBottom = value.bottom;
            target.paddingLeft = value.left;
            target.paddingTopUnit = "px";
            target.paddingRightUnit = "px";
            target.paddingBottomUnit = "px";
            target.paddingLeftUnit = "px";
        }
    },

    paddingTop: genUnitValueSetter("paddingTop"),
    paddingRight: genUnitValueSetter("paddingRight"),
    paddingBottom: genUnitValueSetter("paddingBottom"),
    paddingLeft: genUnitValueSetter("paddingLeft"),

    borderRadiusTopLeft: genUnitValueSetter("borderRadiusTopLeft"),
    borderRadiusTopRight: genUnitValueSetter("borderRadiusTopRight"),
    borderRadiusBottomLeft: genUnitValueSetter("borderRadiusBottomLeft"),
    borderRadiusBottomRight: genUnitValueSetter("borderRadiusBottomRight"),

    borderTopWidth: genUnitValueSetter("borderTopWidth"),
    borderRightWidth: genUnitValueSetter("borderRightWidth"),
    borderBottomWidth: genUnitValueSetter("borderBottomWidth"),
    borderLeftWidth: genUnitValueSetter("borderLeftWidth"),

    shadowVertical: genUnitValueSetter("shadowVertical"),
    shadowHorizontal: genUnitValueSetter("shadowHorizontal"),
    shadowSpread: genUnitValueSetter("shadowSpread"),
    shadowBlur: genUnitValueSetter("shadowBlur"),

};

export class StyleSet {

    public prev : StyleSet;

    public baseStyle : StylePropertySet;
    public hoverStyle : StyleSet;
    public disabledStyle : StyleSet;

    constructor(previous : StyleSet = null) {
        this.prev = previous;
        this.baseStyle = new StylePropertySet();
    }

    public getHoverState() {
        if(this.hoverStyle === null) {
            this.hoverStyle = new StyleSet();
            this.hoverStyle.prev = this;
        }
        return this.hoverStyle;
    }

    public setHoverState() {}

    public getDisableState() {}

    public setDisableState() {}

    public getFocusedState() {}

    public setFocusedState() {}

    public setProperty(property : string, value : any) {
        var setter = setters[property];
        if (setter !== void 0) {
            if (setter !== void 0) {
                setter.call(this, value);
            }
        }
    }

    public setProperties(def : any) {
        var keys = Object.keys(def);
        for (let i = 0; i < keys.length; i++) {
            var property = keys[i];
            var setter = setters[property];
            if (setter !== void 0) {
                setter.call(this, def[property]);
            }
        }
        //emit change event
    }

    public setStateProperty(metaState : string, property : string, value : any) {
        var setter = setters[property];
        if (setter !== void 0) {
            // var stateStyleSet = this[metaState + "Style"];
            setter(this.baseStyle, value);
            //emit change event
        }
    }

    public removeStateProperty(metaState : string, property : string) {}

    public reset(stateName : string = "") : void {}

    public getState(stateName : string) : StyleSet {
        var retn = (this as any)[stateName + "State"];
        if (retn === void 0) return null;
        return retn;
    }

    public getBackgroundColor : Color;
    public getBackgroundSize : Pair<float, float>;
    public getBackgroundPosition : Vector2;
    public getBackgroundImage : BackgroundImage;
    public getBackgroundClip : BackgroundClip;
    public getBackgroundRepeat : BackgroundRepeat;
    public getBackgroundScroll : BackgroundScroll;

    public getBorderRadiusTopLeft : UnitValueGetter;
    public getBorderRadiusTopRight : UnitValueGetter;
    public getBorderRadiusBottomLeft : UnitValueGetter;
    public getBorderRadiusBottomRight : UnitValueGetter;

    public getBorderTopStyle : integer;
    public getBorderBottomStyle : integer;
    public getBorderLeftStyle : integer;
    public getBorderRightStyle : integer;

    public getBorderTopWidth : UnitValueGetter;
    public getBorderBottomWidth : UnitValueGetter;
    public getBorderLeftWidth : UnitValueGetter;
    public getBorderRightWidth : UnitValueGetter;

    public getBorderTopImageId : integer;
    public getBorderBottomImageId : integer;
    public getBorderLeftImageId : integer;
    public getBorderRightImageId : integer;

    public getBorderTopColor : Color;
    public getBorderBottomColor : Color;
    public getBorderLeftColor : Color;
    public getBorderRightColor : Color;

    public getShadowInset : boolean;
    public getShadowVertical : UnitValueGetter;
    public getShadowHorizontal : UnitValueGetter;
    public getShadowSpread : UnitValueGetter;
    public getShadowBlur : UnitValueGetter;
    public getShadowColor : Color;

    public getPaddingTop : UnitValueGetter;
    public getPaddingBottom : UnitValueGetter;
    public getPaddingLeft : UnitValueGetter;
    public getPaddingRight : UnitValueGetter;

    public getOpacity : float;
    public getVisibility : Visibility;
    public getBackfaceVisibility : Visibility;
}

var p = StyleSet.prototype;
// public getBackgroundColor : Color;
// public getBackgroundSize : Pair<float, float>;
// public getBackgroundPosition : Vector2;
// public getBackgroundImage : BackgroundImage;
// public getBackgroundClip : BackgroundClip;
// public getBackgroundRepeat : BackgroundRepeat;
// public getBackgroundScroll : BackgroundScroll;

p.getBorderRadiusTopLeft = genUnitValueGetter("borderRadiusTopLeft");
p.getBorderRadiusTopRight = genUnitValueGetter("borderRadiusTopRight");
p.getBorderRadiusBottomLeft = genUnitValueGetter("borderRadiusBottomLeft");
p.getBorderRadiusBottomRight = genUnitValueGetter("borderRadiusBottomRight");

// p.getBorderTopStyle : integer;
// p.getBorderBottomStyle : integer;
// p.getBorderLeftStyle : integer;
// p.getBorderRightStyle : integer;

p.getBorderTopWidth = genUnitValueGetter("borderTopWidth");
p.getBorderBottomWidth = genUnitValueGetter("borderBottomWidth");
p.getBorderLeftWidth = genUnitValueGetter("borderLeftWidth");
p.getBorderRightWidth = genUnitValueGetter("borderRightWidth");

// p.getBorderTopImageId : integer;
// p.getBorderBottomImageId : integer;
// p.getBorderLeftImageId : integer;
// p.getBorderRightImageId : integer;
//
// p.getBorderTopColor : Color;
// p.getBorderBottomColor : Color;
// p.getBorderLeftColor : Color;
// p.getBorderRightColor : Color;

// p.getShadowInset : boolean;
// p.getShadowVertical = null;
// p.getShadowHorizontal = null;
// p.getShadowSpread = null;
// p.getShadowBlur = null;

// p.getShadowColor : Color;

p.getPaddingTop = genUnitValueGetter("paddingTop");
p.getPaddingBottom = genUnitValueGetter("paddingBottom");
p.getPaddingLeft = genUnitValueGetter("paddingLeft");
p.getPaddingRight = genUnitValueGetter("paddingRight");

// p.getOpacity : float;
// p.getVisibility : Visibility;
// p.getBackfaceVisibility : Visibility;

function genUnitValueGetter(propertyName : string) : UnitValueGetter {
    return function () : UnitValue {
        var retn = new UnitValue(1, UnitType.Pixel);
        if (this.baseStyle === null) {
            return retn;
        }
        var style = this.baseStyle[propertyName];
        if (style === void 0) {
            return retn;
        }
        retn.multiple = style;
        retn.unit = this.baseStyle[propertyName + "Unit"];
        return retn;
    }
}

function genUnitValueSetter(propertyName : string) {
    return function (value : string | number | UnitValue) {
        if (typeof value === "string") {
            StyleParsers[propertyName](this.baseStyle, value);
        }
        else if (typeof value === "number") {
            this.baseStyle[propertyName] = value;
            this.baseStyle[propertyName + "Unit"] = "px";
        }
        else if (value instanceof UnitValue) {
            this.baseStyle[propertyName] = value.multiple;
            this.baseStyle[propertyName + "Unit"] = value.unit;
        }
    }
}

//todo let the compiler generate these depending on usage, ie only generate used ones
function genFloatSetter(propertyName : string) : FloatSetter {
    return new Function("styleName", "stateName = '', value = 0", `
        var style = this.styles.get(styleName);
        if(style === void 0) return;
        style.${propertyName} = value;
    `) as any;
}

function genFloatGetter(propertyName : string) : FloatGetter {
    return new Function("styleName", "stateName = ''", `
        var style = this.styles.get(styleName);
        if(style === void 0) return 0;
        return style.${propertyName};
    `) as any;
}