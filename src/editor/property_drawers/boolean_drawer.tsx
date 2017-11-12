import * as React from "react";
import {IPropertyDrawerProps, propertyDrawer, PropertyDrawer} from "./property_drawer";
import {Checkbox} from "@blueprintjs/core";

@propertyDrawer(Boolean)
export class BooleanDrawer extends React.Component<IPropertyDrawerProps<boolean>, {}> {

    public render() {
        return <PropertyDrawer label={this.props.label}>
            <Checkbox defaultChecked={this.props.value} className="no-margin"/>
        </PropertyDrawer>;
    }

}