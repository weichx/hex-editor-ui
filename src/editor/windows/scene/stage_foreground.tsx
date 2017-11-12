import * as React from "react";
import {EditorElement} from "../../editor_element";
import {EditorState} from "../../editor_actions";
import {StateTreeNode} from "../../../state_tree/state_tree_node";
import {IVector2} from "../../../math/vector2";
import {Entity} from "../../../runtime/entity";

class SelectionOutline {

    public gfx : PIXI.Graphics;

    constructor(container : PIXI.Container) {
        this.gfx = container.addChild(new PIXI.Graphics());
    }

    public paint(entity : Entity) {
        // const
        this.gfx.clear();
        //if(entity !== null) {
        this.gfx.lineStyle(1, 0xFF00CD);
        this.gfx.drawRect(10, 10, 100, 100);
        //}
    }

}

export class StageForeground extends EditorElement<{ windowId : number }, {}> {

    private ctx : CanvasRenderingContext2D = null;
    private canvas : HTMLCanvasElement = null;
    private dimensionRefPath : string;
    protected pixi : PIXI.WebGLRenderer;
    protected pixiRoot : PIXI.Container;
    protected selectionOutline : SelectionOutline;

    //@stateTree("/selection/0/")
    protected selectedEntity : Entity;

    constructor(props : { windowId : number }) {
        super(props);
        this.pixi = null;
        this.pixiRoot = null;
        this.selectionOutline = null;
        this.dimensionRefPath = "/windows/scene/" + this.props.windowId + "/dimensions";
        EditorState.getRef(this.dimensionRefPath).onValueChanged(this.onSceneDimensionChanged);
        EditorState.getRef("/selection").onValueChanged(this.onSelectionChanged);
        //Selection.get(id, "path", "to", "thing");
    }

    public shouldComponentUpdate() {
        return false;
    }

    //@AppEvent.SelectionChanged
    private onSelectionChanged(ref : StateTreeNode) : void {
        const id = ref.getValue() as any;
        if(id && id[0]) {
            this.selectedEntity = EditorState.getRef("/entities/" + id[0]).getValue();
        }
    }

    public onUpdate() {
        if (this.pixi === null) return;
        //EditorState.getRef(Entity, this.selectedEntityId).boundingBox;
        this.selectionOutline.paint(this.selectedEntity);
        this.pixi.render(this.pixiRoot);
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
        if (size !== null) {
            this.canvas.width = size.x;
            this.canvas.height = size.y;
            this.pixi.resize(size.x, size.y);
        }
    };

    private onCanvasReady = (canvas : HTMLCanvasElement) => {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        const size = EditorState.getRef(this.dimensionRefPath).getValue<IVector2>();
        if (size !== null) {
            this.canvas.width = size.x;
            this.canvas.height = size.y;
        }
        this.pixiRoot = new PIXI.Container();
        this.selectionOutline = new SelectionOutline(this.pixiRoot);
        this.pixi = new PIXI.WebGLRenderer({
            width: 256,
            height: 256,
            autoResize: true,
            antialias: true,
            transparent: true
            // view: this.canvas
        });
        //PIXI seems to have a bug where if it doesn't create the canvas it can't get the webgl context :(
        var parent = this.canvas.parentElement;
        this.canvas.remove();
        this.pixi.view.classList.add("overlay-canvas");
        this.canvas = this.pixi.view;
        parent.appendChild(this.pixi.view);
    };
}