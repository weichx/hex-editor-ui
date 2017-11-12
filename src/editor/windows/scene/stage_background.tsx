import * as React from "react";
import {EditorElement} from "../../editor_element";
import {EditorState} from "../../editor_actions";
import {StateTreeNode} from "../../../state_tree/state_tree_node";
import {IVector2} from "../../../math/vector2";
import {WindowColors} from "./scene_window";

export class StageBackground extends EditorElement<{ windowId : number }, {}> {

    private ctx : CanvasRenderingContext2D = null;
    private canvas : HTMLCanvasElement = null;
    private dimensionRefPath : string;

    constructor(props : { windowId : number }) {
        super(props);
        this.dimensionRefPath = "/windows/scene/" + this.props.windowId + "/dimensions";
        EditorState.getRef(this.dimensionRefPath).onValueChanged(this.onSceneDimensionChanged);
    }

    public shouldComponentUpdate() {
        return false;
    }

    public onDestroyed() {
        EditorState.getRef(this.dimensionRefPath).offValueChanged(this.onSceneDimensionChanged);
    }

    public render() {
        return <canvas ref={this.onCanvasReady} className="overlay-canvas"/>
    }

    private onSceneDimensionChanged = (ref : StateTreeNode) => {
        if (this.canvas === null) return;
        const size = ref.getValue<IVector2>();
        if(size !== null) {
            this.paint(size.x, size.y);
        }
    };

    private onCanvasReady = (canvas : HTMLCanvasElement) => {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        const size = EditorState.getRef(this.dimensionRefPath).getValue<IVector2>();
        if(size !== null) {
            this.paint(size.x, size.y);
        }
    };

    private paint(width : number, height : number) : void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = WindowColors.sceneBackground;
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.2;
        this.ctx.beginPath();
        const spacing = 25;
        for (let i = 0; i < 100; i++) {
            const interval = i * spacing + 0.5;
            this.ctx.moveTo(0, interval);
            this.ctx.lineTo(width, interval);
            this.ctx.moveTo(interval, 0);
            this.ctx.lineTo(interval, height);
        }

        this.ctx.closePath();
        this.ctx.stroke();
    }

}
