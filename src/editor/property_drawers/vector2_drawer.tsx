import * as React from "react";
import {Vector2} from "../../math/vector2";
import {NumericInput} from "@blueprintjs/core";
import {IPropertyDrawerProps, PropertyDrawer, propertyDrawer} from "./property_drawer";

@propertyDrawer(Vector2)
export class Vector2Drawer extends React.Component<IPropertyDrawerProps<Vector2>, {}> {

    private onChange = () => {

    };

    render() {
        return <PropertyDrawer label={this.props.label}>
            <div className="vector-drawer">
                <label> X </label>
                <NumericInput onChange={this.onChange} buttonPosition="none"/>
                <label> Y </label>
                <NumericInput onChange={this.onChange} buttonPosition="none"/>
                <label className="hide"> Z </label>
                <div className="vector-spacing hide"/>
            </div>
        </PropertyDrawer>;
    }

}