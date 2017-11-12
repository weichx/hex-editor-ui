export class Asset<T> {

    public readonly uri : string;
    protected data : T;

    protected loadPromise : Promise<this>;
    public isLoaded : boolean;

    constructor(uri : string) {
        this.uri = "./assets/" + uri;
        this.data = null;
        this.loadPromise = null;
        this.isLoaded = false;
    }

    public getData() : T {
        return this.data;
    }

    public load() : Promise<Asset<T>> {
        return null;
    }

}
