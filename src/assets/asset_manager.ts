import {Asset} from "./asset";

export class AssetManager {

    private assets : Array<Asset<any>>;

    constructor() {
        this.assets = [];
    }

    public getAsset<T extends Asset<any>>(assetUri : string, type : INewable<T>) : T {
        var prefixed = "./assets/" + assetUri;
        for (let i = 0; i < this.assets.length; i++) {
            if (this.assets[i].uri === prefixed) {
                return this.assets[i] as T;
            }
        }
        var asset = new type(assetUri);
        asset.load();
        this.assets.push(asset);
        return asset;
    }

    private static instance = new AssetManager();

    public static get<T extends Asset<any>>(assetUri : string, assetType : INewable<T>) : T {
        return AssetManager.instance.getAsset(assetUri, assetType);
    }

}