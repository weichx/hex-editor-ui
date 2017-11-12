import {Asset} from "./asset";

export class ImageAsset extends Asset<HTMLImageElement> {

    public load() : Promise<ImageAsset> {
        if (this.data === null) {
            this.data = new Image();
            this.data.src = this.uri;
            this.loadPromise = new Promise((resolve : any) => {
                this.data.onload = () => {
                    resolve(this);
                    this.isLoaded = true;
                }
            });
        }
        return this.loadPromise;
    }

}