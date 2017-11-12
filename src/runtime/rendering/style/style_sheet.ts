import {StyleParsers} from "../../parsing/style_parser";
import {StylePropertySet} from "./style_property_set";
import {UnitValue} from "../../unit";

// type StyleMetaState = "hover" | "disable" | "focus" | "active" | "visited";
type FloatGetter = (stateName : string, metaState? : string) => float;
type FloatSetter = (stateName : string, metaState? : string, value? : float) => void;
type UnitValueGetter = (stateName : string) => UnitValue;
type UnitValueSetter = any;

export class SharedStyleSheet {

    protected styles : Map<string, StylePropertySet>;

    constructor(init : Indexable<any> = null) {
        this.styles = new Map<string, StylePropertySet>();
        if (init !== null) {
            var keys = Object.keys(init);
            for (var i = 0; i < keys.length; i++) {
                this.set(keys[i], init[keys[i]]);
            }
        }
    }

    public get styleCount() : integer {
        return this.styles.size;
    }

    public getStyleNames() : string[] {
        var out = new Array<string>(this.styles.size);
        var i = 0;
        this.styles.forEach(function (value : StylePropertySet, key : string) {
            value;
            out[i++] = key;
        });
        return out;
    }

    public set(styleName : string, styles : any) : void {
        var styleSet = this.styles.get(styleName);
        if (styleSet === void 0) {
            styleSet = new StylePropertySet();
            this.styles.set(styleName, styleSet);
        }
        var keys = Object.keys(styles);
        for (var i = 0; i < keys.length; i++) {
            var parser = StyleParsers[keys[i]];
            if (parser !== void 0) {
                parser(styleSet, styles[keys[i]]);
            }
        }
    }

    public getPaddingTop : UnitValueGetter;
    public getPaddingRight : UnitValueGetter;
    public getPaddingBottom : UnitValueGetter;
    public getPaddingLeft : UnitValueGetter;

    public setPaddingTop : UnitValueSetter;
    public setPaddingRight : UnitValueSetter;
    public setPaddingBottom : UnitValueSetter;
    public setPaddingLeft : UnitValueSetter;

}

//sheet -> define group of styles
//style component -> manage entity styles

// class StyleComponent {
//
//     protected baseStyleSheet : SharedStyleSheet;
//     protected currentStyle : any;
//     protected currentMetaState : string;
//
//     protected head : any;
//
//     public setMetaState() : void {}
//
//     public clearMetaState() : void {}
//
//     // public getSharedStyleSet() : StyleSet {}
//     //
//     // public getStyleSet() : StyleSet {}
//
//     public setProperty() : void {}
//
//     public setProperties() : void {}
//
//     public addStyles() : void {}
//
//     // public addMetaStyle(metaState : string, style : any) {}
//     //
//     // public setMetaStateProperty(metaState : string, property : string, value : any) {}
//     //
//     // public removeMetaStateProperty(metaState : string, property : string) {}
//
//     public clearStyles() : void {}
//
//     public getCurrentStyle() : void {}
//
//     public getPaddingLeft() : UnitValue {
//         var ptr = this.head;
//         var retn = new UnitValue(1, UnitType.Pixel);
//         while (ptr !== null) {
//             var element = ptr.element;
//             if (element.paddingLeft !== "INVALID") {
//                 retn.multiple = element.paddingLeft;
//                 retn.unit = element.paddingLeftUnit;
//                 return retn;
//             }
//             ptr = ptr.next;
//         }
//         return retn;
//     }
//
//     public getPaddingLeftValue() : number {
//         var ptr = this.head;
//         while (ptr !== null) {
//             var element = ptr.element;
//             if (element.paddingLeft !== "INVALID") {
//                 return this.convertToPixels(element.paddingLeft, element.paddingLeftUnit);
//             }
//             ptr = ptr.next;
//         }
//         return 0;
//     }
//
//     protected convertToPixels(value : number, unit : UnitType) : number {
//         value;
//         unit;
//         throw "Not implemented";
//         // switch (unit) {
//         //     case "px":
//         //         return value;
//         //     case "%":
//         //         return (value * 0.01); // * this.transform.getPixelWidth();
//         //     default:
//         //         return 0;
//         // }
//     }
// }

var p = SharedStyleSheet.prototype;

p.getPaddingTop = genUnitValueGetter("paddingTop");
p.getPaddingRight = genUnitValueGetter("paddingRight");
p.getPaddingBottom = genUnitValueGetter("paddingBottom");
p.getPaddingLeft = genUnitValueGetter("paddingLeft");

p.setPaddingTop = genFloatSetter("paddingTop");
p.setPaddingRight = genFloatSetter("paddingRight");
p.setPaddingBottom = genFloatSetter("paddingBottom");
p.setPaddingLeft = genFloatSetter("paddingLeft");

function genUnitValueGetter(propertyName : string) : UnitValueGetter {
    return new Function("styleName", "stateName = ''", `
        var style = this.styles.get(styleName);
        if(style === void 0) return null;
        return {value: style.${propertyName}, unit: style.${propertyName + "Unit"}};
    `) as any;
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