import * as React from "react";
import {IPropertyDrawerProps, propertyDrawer, PropertyDrawer} from "./property_drawer";

@propertyDrawer(String)
export class StringDrawer extends React.Component<IPropertyDrawerProps<string>, {}> {

    render() {
        return <PropertyDrawer label={this.props.label}>
            <input className="pt-input pt-fill" type="text"/>
        </PropertyDrawer>
    }

}