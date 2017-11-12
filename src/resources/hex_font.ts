export enum HexFontStyle {
    None = 0,
    Bold = 1 << 0,
    Italic = 1 << 1,
    Underline = 1 << 2
}

//for new browsers can use Font Loading API (all but Microsoft)
//for older browsers can probably make font from data uri work
//and can then do resource management on it
//http://jonraasch.com/blog/css-data-uris-in-all-browsers
export class HexFont {

    public size : number;
    public name : string;
    public lineHeight : number;
    private style : HexFontStyle; //can combine size + style

    constructor(name : string = "Arial") {
        this.size = 12;
        this.name = name;
        this.lineHeight = 1;
        this.style = 0;
    }

    public get bold() : boolean {
        return (this.style & HexFontStyle.Bold) !== 0;
    }

    public set bold(value : boolean) {
        this.style = this.style | HexFontStyle.Bold;
    }

    public get italic() : boolean {
        return (this.style & HexFontStyle.Italic) !== 0;
    }

    public set italic(value : boolean) {
        this.style = this.style | HexFontStyle.Italic;
    }

    public get underline() : boolean {
        return (this.style & HexFontStyle.Underline) !== 0;
    }

    public set underline(value : boolean) {
        this.style = this.style | HexFontStyle.Underline;
    }

    public getString() {
        var str = "";
        if (this.italic) str += "italic ";
        if (this.bold) str += "bold ";
        return str + this.size + "px " + this.name;
    }

}