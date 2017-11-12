import * as React from "react";

export interface IPropertyDrawerProps<T> {
    label : string;
    value : T;
    // onChange? : ()
}

export const propertyDrawerForType = new Map<Function, typeof React.Component>();

export function propertyDrawer<T extends INewable<React.Component<any, any>>>(type : INewable<any>) {
    return function(target : INewable<React.Component<any, any>>) {
        propertyDrawerForType.set(type, target);
    }
}

interface IPropertyDrawerShellProps {
    label : string;
    children: JSX.Element | JSX.Element[];
}

export class PropertyDrawer extends React.Component<IPropertyDrawerShellProps, {}> {

    public render() {
        return <div className="property-drawer">
            <div className="property-drawer-label">
                {this.props.label}
            </div>
            <div className="property-drawer-content">
                {this.props.children}
            </div>
        </div>;
    }

}


