//as a packed array this is roughly 20 floats when combining units and flags
//which means ~128 bytes per instance
//generally id assume that shared styles are used more often than individual ones
//so its not a 1 - 1 mapping of style components to property sets

//todo split into Hot, Cold, and Structure sets
//todo its possible to pack floats into ints in the range 0 - 655.36 by multipling / dividing by 100
//probably reasonable to do this with lesser used vector properties likes size X/Y and bg position X/Y

export enum PaintPropertyId {
    // Background
    BackgroundColor = 1 << 0,
    BackgroundSizeX = 1 << 1,
    BackgroundSizeY = 1 << 2,
    BackgroundSize = BackgroundSizeX | BackgroundSizeY,
    BackgroundPositionX = 1 << 3,
    BackgroundPositionY = 1 << 4,
    BackgroundPosition = BackgroundPositionX | BackgroundPositionY,
    BackgroundImage = 1 << 5,
    BackgroundClip = 1 << 6,
    BackgroundRepeat = 1 << 7,
    BackgroundScroll = 1 << 8,

    BorderRadiusTopLeft = 1 << 9,
    BorderRadiusTopRight = 1 << 10,
    BorderRadiusBottomLeft = 1 << 11,
    BorderRadiusBottomRight = 1 << 12,

    BorderTopStyle = 1 << 13,
    BorderBottomStyle = 1 << 14,
    BorderLeftStyle = 1 << 15,
    BorderRightStyle = 1 << 16,

    BorderTopImageId = 1 << 17,
    BorderBottomImageId = 1 << 18,
    BorderLeftImageId = 1 << 19,
    BorderRightImageId = 1 << 20,

    BorderTopColor = 1 << 21,
    BorderBottomColor = 1 << 22,
    BorderLeftColor = 1 << 23,
    BorderRightColor = 1 << 24,

    ShadowInset = 1 << 25,
    ShadowVertical = 1 << 26,
    ShadowHorizontal = 1 << 27,
    ShadowSpread = 1 << 28,
    ShadowBlur = 1 << 29,
    ShadowColor = 1 << 30

}

export const enum StructurePropertyId {
    BorderTopWidth = 1 << 0,
    BorderBottomWidth = 1 << 1,
    BorderLeftWidth = 1 << 2,
    BorderRightWidth = 1 << 3,
    PaddingTop = 1 << 4,
    PaddingBottom = 1 << 5,
    PaddingLeft = 1 << 6,
    PaddingRight = 1 << 7,
    MarginTop = 1 << 8,
    MarginBottom = 1 << 9,
    MarginLeft = 1 << 10,
    MarginRight = 1 << 11
}

export const enum VisibilityPropertyId {
    Opacity = 1 << 0,
    Visibility = 1 << 1,
    BackfaceVisibility = 1 << 2
}

/** @internal */
    //todo -- many of these can be combined / packed
    //todo -- maybe break into hot / cold set or similar partitioning

export class StylePropertySet {
    [idx : string] : any;
    // public prev : StylePropertySet;
    // public backgroundColor : Color;
    // public backgroundSize : Pair<float, float>;
    // public backgroundPosition : Vector2;
    // public backgroundImage : BackgroundImage;
    // public backgroundClip : BackgroundClip;
    // public backgroundRepeat : BackgroundRepeat;
    // public backgroundScroll : BackgroundScroll;
    // public borderRadiusTopLeft : float;
    // public borderRadiusTopRight : float;
    // public borderRadiusBottomLeft : float;
    // public borderRadiusBottomRight : float;
    // public borderRadiusTopLeftUnit : Unit;
    // public borderRadiusTopRightUnit : Unit;
    // public borderRadiusBottomLeftUnit : Unit;
    // public borderRadiusBottomRightUnit : Unit;
    // public borderTopStyle : integer;
    // public borderBottomStyle : integer;
    // public borderLeftStyle : integer;
    // public borderRightStyle : integer;
    // public borderTopWidth : float;
    // public borderBottomWidth : float;
    // public borderLeftWidth : float;
    // public borderRightWidth : float;
    // public borderTopImageId : integer;
    // public borderBottomImageId : integer;
    // public borderLeftImageId : integer;
    // public borderRightImageId : integer;
    // public borderTopColor : Color;
    // public borderBottomColor : Color;
    // public borderLeftColor : Color;
    // public borderRightColor : Color;
    // public shadowInset : boolean;
    // public shadowVertical : float;
    // public shadowHorizontal : float;
    // public shadowSpread : float;
    // public shadowBlur : float;
    // public shadowVerticalUnit : Unit;
    // public shadowHorizontalUnit : Unit;
    // public shadowSpreadUnit : Unit;
    // public shadowBlurUnit : Unit;
    // public shadowColor : Color;
    // public paddingTop : float;
    // public paddingBottom : float;
    // public paddingLeft : float;
    // public paddingRight : float;
    // public paddingTopUnit : Unit;
    // public paddingBottomUnit : Unit;
    // public paddingLeftUnit : Unit;
    // public paddingRightUnit : Unit;
    // public opacity : float;
    // public visibility : Visibility;
    // public backfaceVisibility : Visibility;

}