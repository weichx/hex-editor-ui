import {Stack} from "../util/stack";
import {Timer} from "../util/timer";
import {HexApplication} from "../hex_application";

type UpdateListener = { onUpdate: (time? : number) => void};
export class ApplicationRuntime {

    private static instance : ApplicationRuntime = null;
    private appStack : Stack<HexApplication>;
    private appList : Array<HexApplication>;
    private appMap : Indexable<HexApplication>;
    private isRunning : boolean;
    private frameId : number;
    private updateListeners : Array<UpdateListener>;

    constructor() {
        if (ApplicationRuntime.instance !== null) {
            throw new Error("Cannot create a second runtime instance!");
        }
        ApplicationRuntime.instance = this;
        this.updateListeners = [];
        this.appMap = {};
        this.appStack = new Stack<HexApplication>(1);
        this.appList = new Array<HexApplication>();
        this.isRunning = false;
        this.frameId = 0;
    }

    public createApplication<T extends HexApplication>(appType : INewable<T>, name : string) : T {
        const application = new appType();
        this.appList.push(application);
        this.appStack.push(application);
        this.appMap[name] = application;
        return application;
    }

    public destroyApplication<T extends HexApplication>(application : T) : void {
        application.unload();
        var tempStack = new Array<HexApplication>();
        while(this.appStack.count) {
            var app = this.appStack.pop();
            if(app !== application) {
                tempStack.push(app);
            }
        }
        tempStack = tempStack.reverse();
        for(let i = 0; i < tempStack.length; i++) {
            this.appStack.push(tempStack[i]);
        }

        //todo -- wrong! rebuild stack instead
        if(this.appStack.peek() === application) {
            this.appStack.pop();
        }
        this.appList.remove(application);
        var keys = Object.keys(this.appMap);
        for(let i = 0; i < keys.length; i++) {
            if(this.appMap[keys[i]] === application) {
                this.appMap[keys[i]] = null;
                return;
            }
        }

    }

    public pushApplication(app : HexApplication) : void {
        this.appStack.push(app);
    }

    public popApplication() : HexApplication {
        return this.appStack.pop();
    }

    public getAppStackSize() : number {
        return this.appStack.count;
    }

    public getApplication(name : string) : HexApplication {
        return this.appMap[name];
    }

    public start() : void {
        this.isRunning = true;
        ApplicationRuntime.loop(0);
    }

    public stop() : void {
        this.isRunning = false;
    }

    public tick(time : number) : void {
        this.updateListeners.forEach(function(listener : UpdateListener) {
            listener.onUpdate(time);
        });

        for (var i = 0; i < this.appList.length; i++) {
            this.appList[i].update(time);
        }

        Timer.Tick(time);
        this.frameId++;
    }

    public getFrameId() : number {
        return this.frameId;
    }

    public getCurrentApp() : HexApplication {
        return this.appStack.peek();
    }

    public addUpdateListener(listener : UpdateListener) {
        const idx = this.updateListeners.indexOf(listener);
        if(idx === -1) this.updateListeners.push(listener);
    }

    public removeUpdateListener(listener : UpdateListener) {
        this.updateListeners.remove(listener);
    }

    private static loop(time : number) {
        ApplicationRuntime.instance.tick(time);
        if (ApplicationRuntime.instance.isRunning) {
            requestAnimationFrame(ApplicationRuntime.loop);
        }
    }

}

//potentially use a single / multiple runtime host version for single app pages and multi-app pages
export const HexRuntime = (window as any).HexRuntime = new ApplicationRuntime();