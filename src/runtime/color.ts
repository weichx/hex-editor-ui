//color values expected to be 0 - 255
// import {getRandomInt} from "../util/random";

export class Color {

    public r : number;
    public g : number;
    public b : number;
    public a : number;

    constructor(r = 0, g = 0, b = 0, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public copy(input : any) : any {
        this.r = input.r;
        this.g = input.g;
        this.b = input.b;
        this.a = input.a;
        return this;
    }

    public clone(out? : Color) : Color {
        return (out || new Color()).copy(this);
    }

    public fromHexAlpha(hexValue : integer) : this {
        this.r = (hexValue >> 24) & 0xff / 255;
        this.g = (hexValue >> 16) & 0xff / 255;
        this.b = (hexValue >> 8) & 0xff / 255;
        this.a = (hexValue & 0xff) / 255;
        return this;
    }

    public toHex() : number {
        const intR = (this.r) | 0;
        const intG = (this.g) | 0;
        const intB = (this.b) | 0;
        return ((intR & 0xff) << 16) + ((intG & 0xff) << 8) + (intB & 0xff);
    }

    public toHexAlpha() : number {
        const intR = (this.r) | 0;
        const intG = (this.g) | 0;
        const intB = (this.b) | 0;
        const intA = (this.a) | 0;
        return ((intR & 0xff) << 24) +
            ((intG & 0xff) << 16) +
            ((intB & 0xff) << 8) +
            (intA & 0xff);
    }

    public toCSSString() : string {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }

    public static toRGBAString(input : uint32) : string {
        input >>>= 0;
        var a = (input & 0xFF) / 255;
        var b = (input & 0xFF00) >>> 8;
        var g = (input & 0xFF0000) >>> 16;
        var r = ((input & 0xFF000000) >>> 24);
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }

    public toHexString() : string {
        return '#' + ('0000000' + this.toHex().toString(16)).slice(-6)
    }

    public toHexAString() : string {
        return '#' + ('000000000' + this.toHexAlpha().toString(16)).slice(-8)
    }

    public toRgbString() : string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    public toRgbaString() : string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    public static FromHex(hexValue : number) : Color {
        return new Color(
            ((hexValue >> 16) & 0xff),
            ((hexValue >> 8) & 0xff),
            ((hexValue) & 0xff)
        );
    }

    public static FromHexAlpha(hexValue : number) : Color {
        return new Color(
            ((hexValue >> 24) & 0xff),
            ((hexValue >> 16) & 0xff),
            ((hexValue >> 8) & 0xff),
            ((hexValue & 0xff))
        );
    }

    public static HexToString(hexValue : integer) : string {
        return Color.internalScratch.fromHexAlpha(hexValue).toHexAString();
    }

    private static internalScratch = new Color();

    public static get Black() : Readonly<Color> { return new Color(0, 0, 0, 255); }

    public static get Blue() : Readonly<Color> { return new Color(0, 0, 255, 255); }

    public static get Clear() : Readonly<Color> { return new Color(0, 0, 0, 0); }

    public static get Cyan() : Readonly<Color> { return new Color(0, 255, 255, 255); }

    public static get Gray() : Readonly<Color> { return new Color(128, 128, 128, 255); }

    public static get Green() : Readonly<Color> { return new Color(0, 255, 0, 255); }

    public static get Magenta() : Readonly<Color> { return new Color(255, 0, 255, 255); }

    public static get Red() : Readonly<Color> { return new Color(255, 0, 0, 255); }

    public static get Yellow() : Readonly<Color> { return new Color(255, (0.92 * 255 | 0), (0.06 * 255 | 0), 255); }

    public static get White() : Readonly<Color> { return new Color(255, 255, 255, 255); }

    public static get IndianRed() : Readonly<Color> { return new Color() }
}
