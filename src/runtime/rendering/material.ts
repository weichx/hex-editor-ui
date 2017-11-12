import {Color} from "../color";
import {Vector2} from "../../math/vector2";
import {LinkedList} from "../../util/linked_list";
import {PaintPropertyId} from "./style/style_property_set";
import {Visibility} from "../e_visibility";
import {BackgroundClip, BackgroundImage, BackgroundRepeat, BackgroundScroll} from "./background";

export enum UIInteractionState {
    Normal, Focus, Active, Hover, Visited
}

class StyleNode {
    [idx : string] : any;
    public backgroundColor : Color;
    public backgroundSize : Vector2;
    public backgroundPosition : Vector2;
    public backgroundImage : BackgroundImage;
    public backgroundClip : BackgroundClip;
    public backgroundRepeat : BackgroundRepeat;
    public backgroundScroll : BackgroundScroll;

    public borderRadiusTopLeft : float;
    public borderRadiusTopRight : float;
    public borderRadiusBottomLeft : float;
    public borderRadiusBottomRight : float;

    public borderTopStyle : integer;
    public borderBottomStyle : integer;
    public borderLeftStyle : integer;
    public borderRightStyle : integer;
    public borderTopWidth : float;
    public borderBottomWidth : float;
    public borderLeftWidth : float;
    public borderRightWidth : float;
    public borderTopImageId : integer;
    public borderBottomImageId : integer;
    public borderLeftImageId : integer;
    public borderRightImageId : integer;
    public borderTopColor : Color;
    public borderBottomColor : Color;
    public borderLeftColor : Color;
    public borderRightColor : Color;

    public shadowInset : boolean;
    public shadowVertical : float;
    public shadowHorizontal : float;
    public shadowSpread : float;
    public shadowBlur : float;
    public shadowColor : Color;

    //todo move padding to content box
    public paddingTop : float;
    public paddingBottom : float;
    public paddingLeft : float;
    public paddingRight : float;

    public opacity : float;
    public visibility : Visibility;
    public backfaceVisibility : Visibility;

    constructor() {

        this.backgroundColor = null;
        this.backgroundSize = null;
        this.backgroundPosition = null;
        this.backgroundImage = null;
        this.backgroundClip = null;
        this.backgroundRepeat = null;
        this.backgroundScroll = null;

        this.borderRadiusTopLeft = 0.0;
        this.borderRadiusTopRight = 0.0;
        this.borderRadiusBottomLeft = 0.0;
        this.borderRadiusBottomRight = 0.0;
        this.borderRadiusTopLeftUnit = null;
        this.borderRadiusTopRightUnit = null;
        this.borderRadiusBottomLeftUnit = null;
        this.borderRadiusBottomRightUnit = null;
        this.borderTopStyle = -1;
        this.borderBottomStyle = -1;
        this.borderLeftStyle = -1;
        this.borderRightStyle = -1;
        this.borderTopWidth = 0.0;
        this.borderBottomWidth = 0.0;
        this.borderLeftWidth = 0.0;
        this.borderRightWidth = 0.0;
        this.borderTopImageId = -1;
        this.borderBottomImageId = -1;
        this.borderLeftImageId = -1;
        this.borderRightImageId = -1;
        this.borderTopColor = null;
        this.borderBottomColor = null;
        this.borderLeftColor = null;
        this.borderRightColor = null;

        this.shadowInset = false;
        this.shadowVertical = 0.0;
        this.shadowHorizontal = 0.0;
        this.shadowSpread = 0.0;
        this.shadowBlur = 0.0;
        this.shadowVerticalUnit = null;
        this.shadowHorizontalUnit = null;
        this.shadowSpreadUnit = null;
        this.shadowBlurUnit = null;
        this.shadowColor = null;

        //todo move padding to content box
        this.paddingTop = 0.0;
        this.paddingBottom = 0.0;
        this.paddingLeft = 0.0;
        this.paddingRight = 0.0;
        this.paddingTopUnit = null;
        this.paddingBottomUnit = null;
        this.paddingLeftUnit = null;
        this.paddingRightUnit = null;

        this.opacity = 0.0;
        this.visibility = Visibility.Visible;
        this.backfaceVisibility = Visibility.Visible;
    }
}

export class Material {

    public dirtyStyleFields : Array<PaintPropertyId>;
    public styleStates0 : any;

    constructor() {
        this.dirtyStyleFields = [];
        this.styleStates0 = new LinkedList<StyleNode>();
        this.styleStates0.addFirst(new StyleNode());
    }

    public setStyleValue(propertyId : any, propertyValue : any, propertyState : string) {
        //todo only add to dirty fields if in target state
        if (this.dirtyStyleFields.indexOf(propertyId) === -1) {
            this.dirtyStyleFields.push(propertyId);
        }
        this.styleStates0.getHeadNode().element[propertyId] = propertyValue;
    }

    public getStyleValue(propertyId : PaintPropertyId) {
        //override [user-state]
        //override [interaction-state]
        //inherited [user-state]
        //inherited [interaction-state]
        //base [user-state]
        //base [interaction-state]
        var ptr = this.styleStates0.getHeadNode();
        return InterpretStyleValue(propertyId, ptr.element[propertyId]);
    }

}

function InterpretStyleValue(propertyId : string | PaintPropertyId, value : any) {
    switch (propertyId) {
        case "backgroundColor":
        case PaintPropertyId.BackgroundColor:
            return (value as Color).toRgbaString();
    }
    return "";
}

function PropertyToStyleValue(propertyId : string | PaintPropertyId, value : any) {
    switch (propertyId) {
        case PaintPropertyId.BackgroundColor:
        case "backgroundColor":
            if (value instanceof Color) {
                return value;
            }
            else if (typeof value === "string") {
                return value;
            }
            break;
    }
    return -1;
}