import * as React from "react";
import {EditorElement} from "../../editor_element";
import {EditorState} from "../../editor_actions";
import {StageBackground} from "./stage_background";
import {StageForeground} from "./stage_foreground";
import {HexRuntime} from "../../../runtime/runtime";

var idGenerator = 0;

export const WindowColors = {
    backgroundGrey: "#A2A2A2",
    borderGrey: "#828282",
    foregroundGrey: "#C2C2C2",
    selectedTabBodyGrey: "#E4E4E4",
    selectedTabBorderGrey: "#858585",
    sceneBackground: "#5D5D5D"
};


export class SceneWindow extends EditorElement<{}, {}> {

    protected windowId : integer;
    protected stageDom : HTMLDivElement;
    protected windowDom : HTMLDivElement;

    protected width : number;
    protected height : number;

    constructor(props : any) {
        super(props);
        this.width = 0;
        this.height = 0;
        this.windowId = ++idGenerator;
        this.stageDom = null;
        this.windowDom = null;
    }

    public shouldComponentUpdate() {
        return false;
    }

    render() {
        return <div className="stage-window" ref={this.onStageContainerReady}>
            <div className="stage-container">
                <StageBackground windowId={this.windowId}/>
                <div className="stage-render-root" />
                <StageForeground windowId={this.windowId}/>
            </div>
        </div>
    }

    public onUpdate() {
        if (this.windowDom !== null) {
            const clientRect = this.windowDom.getBoundingClientRect();
            if (clientRect.width !== this.width || clientRect.height !== this.height) {
                this.width = clientRect.width;
                this.height = clientRect.height;
                EditorState.getRef("/windows/scene/" + this.windowId + "/dimensions").set({
                    x: this.width,
                    y: this.height
                });
                HexRuntime.getApplication("EditorApp").renderSystem.setRenderTargetSize(this.width, this.height);
                //this.stageBackground.paint(this.width, this.height);
            }
        }
        this.onSceneRender();
    }

    public onSceneRender() {

    }

    private onStageContainerReady = (dom : HTMLDivElement) => {
        this.windowDom = dom;
        this.stageDom = dom.querySelector('.stage-render-root') as HTMLDivElement;
        HexRuntime.getApplication("EditorApp").setMountPoint(this.stageDom);
    };

}

createStyleSheet(`<style>

.stage-window {
    overflow:hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.stage-render-root {
    position: absolute;
    width: 100%;
    height: 100%;
}

.stage-container {
    width: 100%;
    height: 100%;
    position:relative;
}

.overlay-canvas {
    position: absolute;
    top:0;
    left:0;
}

</style>`);