import * as React from "react";
import {HexRuntime} from "../runtime/runtime";

const EmptyFn = function () {};

export class EditorElement<T, U> extends React.Component<T, U> {

    protected listeners : Array<any>;
    protected __isMounted : boolean;
    protected __componentWillUnmountOverride : () => void;
    protected __componentDidMountOverride : () => void;

    constructor(props : T) {
        super(props);
        this.__isMounted = false;
        this.__componentWillUnmountOverride = EmptyFn;
        this.__componentDidMountOverride = EmptyFn;
        this.listeners = [];
        if (this.onSceneRender !== EditorElement.prototype.onSceneRender) {

        }
        if (this.onUpdate !== EditorElement.prototype.onUpdate) {
            HexRuntime.addUpdateListener(this);
        }
        if (this.componentWillUnmount !== EditorElement.prototype.componentWillUnmount) {
            this.__componentWillUnmountOverride = this.componentWillUnmount;
            this.componentWillUnmount = EditorElement.prototype.componentWillUnmount;
        }
        if (this.componentDidMount !== EditorElement.prototype.componentDidMount) {
            this.__componentDidMountOverride = this.componentDidMount;
            this.componentDidMount = EditorElement.prototype.componentDidMount;
        }
    }

    public componentDidMount() {
        if (!this.__isMounted) {
            this.__isMounted = true;
            this.onMount();
        }
    }

    public onSceneRender() {}

    public onMount() {}

    public onUpdate(time : float) {}

    public onDestroyed() {}

    public componentWillUnmount() {
        if (this.__isMounted) {
            this.__isMounted = false;
            for (var i = 0; i < this.listeners.length; i++) {
                //this.listeners[i]();
            }
            this.__componentWillUnmountOverride();
            this.onDestroyed();
        }
    }

}