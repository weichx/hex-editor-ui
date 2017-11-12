import {Asset} from "./asset";
import {HexFont} from "../resources/hex_font";

function boom(fontData : any) {
    const styleTag = document.createElement('style') as any;
    styleTag.type = 'text/css';
    var css = `
    @font-face {
        font-family: '${fontData.familyName}';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/truetype;charset-utf-8;base64,${fontData.data}) format('truetype'); 
    }`;
    if (styleTag.styleSheet) {
        styleTag.styleSheet.cssText = css;
    } else {
        styleTag.appendChild(document.createTextNode(css));
    }

    document.head.appendChild(styleTag);
}

var temp = document.createElement("div");
temp.style.visibility = "hidden";
temp.style.position = "absolute";
document.body.appendChild(temp);

export class FontAsset extends Asset<HexFont> {

    public load() : Promise<this> {
        if (this.data === null) {
            this.data = new HexFont();

            this.loadPromise = new Promise((resolve : any) => {
                var request = new XMLHttpRequest();
                request.open("GET", this.uri);
                request.onreadystatechange = () => {
                    if(request.readyState === 4) {
                        var json = JSON.parse(request.responseText);
                        boom(json);
                        this.data.name = json.familyName;
                        temp.textContent = "Hello Hex";
                        temp.style.font = "12px " + json.familyName;
                        setTimeout(() => {
                            this.isLoaded = true;
                            resolve(this);
                        }, 16);
                    }
                };
                request.send();
            });
        }
        return this.loadPromise;
    }
}