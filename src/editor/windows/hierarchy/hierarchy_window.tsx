import * as React from "react";
import {HexRuntime} from "../../../runtime/runtime";
import {HierarchyTree} from "./hierarchy_tree";
import {Entity} from "../../../runtime/entity";

interface IHierarchyState {
    rootEntity : Entity;
}

export class Hierarchy extends React.Component<{}, IHierarchyState> {

    constructor(props : any) {
        super(props);

        this.state = {
            rootEntity: HexRuntime.getApplication("EditorApp").getRootEntity()
        };

    }

    render() {
        return <div>
            <div className="pt-input-group">
                <span className="pt-icon pt-icon-search"/>
                <input className="pt-input pt-fill" type="search"/>
            </div>
            <HierarchyTree rootEntity={this.state.rootEntity}/>
        </div>
    }

}