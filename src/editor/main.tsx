import * as ReactDOM from "react-dom";
import * as React from "react";
import {Hierarchy} from "./windows/hierarchy/hierarchy_window";
import {HexApplication} from "../hex_application";
import {Inspector} from "./windows/inspector/inspector_window";
import {HexRuntime} from "../runtime/runtime";
import {Entity} from "../runtime/entity";
import {AppEvent} from "../runtime/event";
import {Evt_EntityCreated} from "./events/evt_entity_created";
import {Evt_EntitySetParent} from "./events/evt_entity_set_parent";
import {Evt_EntityChildAdded} from "./events/evt_entity_child_added";
import {Evt_EntityChildRemoved} from "./events/evt_entity_child_removed";
import {UIImage} from "../runtime/rendering/ui_component";
import {SceneWindow} from "./windows/scene/scene_window";
import * as x from "../number";
import SplitPane = require("react-split-pane");
x;
PIXI.utils.skipHello();

class HexEditorApplication extends HexApplication {

    public addEntity(entity : Entity) {
        super.addEntity(entity);
        AppEvent.emit(new Evt_EntityCreated(entity));
        AppEvent.emit(new Evt_EntitySetParent(entity, entity.parent, null));
        AppEvent.emit(new Evt_EntityChildAdded(entity.parent, entity, entity.siblingIndex));
    }

    public setEntityParent(entity : Entity, parent : Entity, oldParent : Entity) : void {
        super.setEntityParent(entity, parent, oldParent);
        AppEvent.emit(new Evt_EntitySetParent(entity, parent, oldParent));
        AppEvent.emit(new Evt_EntityChildAdded(parent, entity, entity.siblingIndex));
        if(oldParent !== null) {
            AppEvent.emit(new Evt_EntityChildRemoved(oldParent, entity));
        }
        //todo -- index changed events?
    }

    public update(time : float) {
        const mouse = this.input.getMousePosition();
        // const mouseOverElement = document.elementFromPoint(mouse.x, mouse.y);
        // var ptr = mouseOverElement;
        // while(ptr && ptr.hasAttribute("data-drag-attr") === false) {
        //     ptr = ptr.parentElement;
        // }
        //if ptr && ptr.contains(mouse)
            //
        super.update(time);
    }

    private handleDragInputEvents() {
        switch ("drag-mode" as any) {
            case "none":
                //if mousedownthisframe
                    //check current element for drag attribute
                    //check all parents for drag attribute
                    //if attr found and element contains mouse
                    //mousedown = true
                break;
            case "mousedown":
                //if distance from mousedown point to current mouse point > 25ish
                    //dragging = true
                break;
            case "dragging":
                //check for current mouse position drag element
                //if mouse is over something that responds to our drag events
                //invoke events for that element
                //if mouse up
                    //dragging = false
                    //if has valid hover element -> drop
                    //else end drag
              break;
        }
    }

    private onEntityCreated() {
       // alert("made an entity");
    }

}

const app = HexRuntime.createApplication(HexEditorApplication, "EditorApp");
// app.setMountPoint(document.getElementById("main"));
HexRuntime.start();

class Test extends React.Component<{}, {}> {

    componentWillMount() {
        new Entity("Hello there 0");
        new Entity("Hello there 1");
        new Entity("Hello there 2");
        new Entity("Hello there 3");
        new Entity("Hello there 4");
        const e = new Entity("With Components");
        const cmp = e.addComponent(UIImage);

    }

    render() {
        return <div>
            <div>
                <nav className="pt-navbar pt-dark">
                    <div className="pt-navbar-group pt-align-left">
                        <div className="pt-navbar-heading">Hex Editor</div>
                        <input className="pt-input" placeholder="Search" type="text" />
                    </div>
                    <div className="pt-navbar-group pt-align-right">
                        {/*<button className="pt-button pt-minimal pt-icon-home">Home</button>*/}
                        {/*<button className="pt-button pt-minimal pt-icon-document">Files</button>*/}
                        <span className="pt-navbar-divider"/>
                        <button className="pt-button pt-minimal pt-icon-user"/>
                        <button className="pt-button pt-minimal pt-icon-notifications"/>
                        <button className="pt-button pt-minimal pt-icon-cog"/>
                    </div>
                </nav>
                <SplitPane split="vertical" defaultSize="20%">
                    <div>
                        <Hierarchy/>
                    </div>
                    <div>
                        <SplitPane defaultSize="70%" split="vertical">
                            <SceneWindow/>
                            <Inspector/>
                        </SplitPane>
                    </div>
                </SplitPane>
            </div>
        </div>
    }

}

ReactDOM.render(<Test/>, document.getElementById("main"));