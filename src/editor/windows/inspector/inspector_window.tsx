import * as React from "react";
import {Inspectors} from "../../inspectors/inspector_lookup";
import {Entity} from "../../../runtime/entity";
import {Component} from "../../../runtime/component";
import {Checkbox, NumericInput} from "@blueprintjs/core";
import {EditorState} from "../../editor_actions";
import {StateTreeNode} from "../../../state_tree/state_tree_node";
import {Vector3} from "../../../math/vector3";
import {Vector3Drawer} from "../../property_drawers/vector3_drawer";
import {StringDrawer} from "../../property_drawers/string_drawer";
import {Vector2} from "../../../math/vector2";
import {Vector2Drawer} from "../../property_drawers/vector2_drawer";
import {ColorDrawer} from "../../property_drawers/color_drawer";
import {Color} from "../../../runtime/color";
import {BooleanDrawer} from "../../property_drawers/boolean_drawer";

export interface IInspectorProps {
    entity : Entity;
    component : Component;
}


//propertyPath
//propertyRoot
//depth
//propertyName
//changeHandler


//serialize on compile, on editor play, on editor stop playing, on editor snapshot
//on inspector context switch, when called manually
//serialize -> go through
// all components
// all entities
// all extending Serializable
// all things with @serialized annotation
// and get reference free json snapshot
// functions do not get serialized
// dom nodes do not get serialized
// browser native references do not get serialized
// input state does not get serialized


export class GenericInspector extends React.Component<IInspectorProps, {}> {

    public render() {
        const entity = this.props.entity;
        const cmp = this.props.component;
        //onChange() => { EditorState.set("/components/id/fieldName", value);
        //someComponent.position = new Vector3();
        //someComponent.someMethodWithSideEffects();
        return <div>
            <div className="pt-control-group">
                <Checkbox defaultChecked={true}/>
                <input className="pt-input" type="text"/>
            </div>
            <div className="pt-control-group">
                <label className="pt-label pt-inline">
                    Tag
                    <div className="pt-select">
                        <select>
                            <option value="2">Choose an item...</option>
                            <option value="1">One</option>
                        </select>
                    </div>
                </label>
            </div>
        </div>;
    }

}

export class Inspector extends React.Component<{}, { selectedEntity : Entity }> {

    constructor(props : {}) {
        super(props);
        this.state = { selectedEntity: null };
        EditorState.getRef("/selection").onValueChanged(this.onSelectionChanged);
    }

    componentWillUnmount() {
        EditorState.getRef("/selection").offValueChanged(this.onSelectionChanged);
    }

    public onSelectionChanged = (ref : StateTreeNode) => {
        const selection = ref.getValue<number[]>();
        if (selection) {
            const entityData = EditorState.getRef("/entities/" + selection[0]).getValue<Entity>();
            this.setState({ selectedEntity: entityData });
        }
    };

    renderComponents() : JSX.Element[] {
        return [
            <GenericInspector key={1} entity={this.state.selectedEntity} component={null}/>,
            <Vector3Drawer key={2} label="My Vector3" value={new Vector3()}/>,
            <Vector2Drawer key={124} label="My Vector2" value={new Vector2()}/>,
            <StringDrawer key={3} label="My String" value="hello"/>,
            <ColorDrawer key={4} label="My Color" value={Color.Blue}/>,
            <BooleanDrawer key={5} label={"My Boolean"} value={true}/>
        ];
    }

    render() {
        return <div>
            {this.renderComponents()}
        </div>;
    }

}
