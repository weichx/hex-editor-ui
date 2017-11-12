import * as React from "react";
import {IPropertyDrawerProps, propertyDrawer, PropertyDrawer} from "./property_drawer";
import {Color} from "../../runtime/color";
import SketchPicker from "react-color/lib/components/sketch/Sketch";
import {Position, Popover} from "@blueprintjs/core";

@propertyDrawer(Color)
export class ColorDrawer extends React.Component<IPropertyDrawerProps<Color>, { color : Color }> {

    constructor(props : IPropertyDrawerProps<Color>) {
        super(props);
        this.state = { color: this.props.value };
    }

    public render() {
        return <PropertyDrawer label={this.props.label}>
            <Popover position={Position.BOTTOM_RIGHT} className="color-drawer" content={this.renderPicker()}>
                <div className="color-drawer-rgb-display" style={{ background: this.state.color.toCSSString() }}/>
            </Popover>
        </PropertyDrawer>
    }

    private renderPicker() {
        return <SketchPicker color={this.state.color} onChange={(colorData) => {
            const color = this.props.value;
            color.r = colorData.rgb.r;
            color.g = colorData.rgb.g;
            color.b = colorData.rgb.b;
            color.a = colorData.rgb.a;
            this.setState({ color: color });
        }}/>;
    }

}