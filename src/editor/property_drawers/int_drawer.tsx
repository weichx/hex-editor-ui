import * as React from "react";
import {IPropertyDrawerProps, propertyDrawer, PropertyDrawer} from "./property_drawer";
import {NumericInput} from "@blueprintjs/core";
import {Integer} from "../../math/integer";

//todo - disallow floating point values

@propertyDrawer(Integer)
export class IntDrawer extends React.Component<IPropertyDrawerProps<number>, {}> {

    render() {
        return <PropertyDrawer label={this.props.label}>
            <NumericInput/>
        </PropertyDrawer>
    }

}