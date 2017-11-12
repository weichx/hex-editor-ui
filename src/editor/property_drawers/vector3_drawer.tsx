import * as React from "react";
import {Vector3} from "../../math/vector3";
import {NumericInput} from "@blueprintjs/core";
import {PropertyDrawer, propertyDrawer} from "./property_drawer";

interface IVector3DrawerProps {
    value : Vector3;
    label : string;
    onChange? : (vector : Vector3) => any;
}

@propertyDrawer(Vector3)
export class Vector3Drawer extends React.Component<IVector3DrawerProps, {}> {

    private onChange = () => {
        if(typeof this.props.onChange === "function") {
            this.props.onChange(this.props.value);
        }
    };

    render() {
        return <PropertyDrawer label={this.props.label}>
            <div className="vector-drawer">
                <label> X </label>
                <NumericInput onChange={this.onChange} buttonPosition="none"/>
                <label> Y </label>
                <NumericInput onChange={this.onChange} buttonPosition="none"/>
                <label> Z </label>
                <NumericInput onChange={this.onChange} buttonPosition="none"/>
            </div>
        </PropertyDrawer>;
    }

}