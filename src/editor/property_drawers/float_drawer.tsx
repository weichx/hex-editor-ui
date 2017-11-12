import * as React from "react";
import {IPropertyDrawerProps, propertyDrawer, PropertyDrawer} from "./property_drawer";
import {NumericInput} from "@blueprintjs/core";
import {Float} from "../../math/float";

@propertyDrawer(Float)
@propertyDrawer(Number)
export class FloatDrawer extends React.Component<IPropertyDrawerProps<number>, {}> {

    render() {
        return <PropertyDrawer label={this.props.label}>
            <NumericInput/>
        </PropertyDrawer>
    }

}