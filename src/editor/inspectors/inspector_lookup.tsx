import * as React from "react";
import {NumericInput, Position} from "@blueprintjs/core";

export const Inspectors : any = {
    string: class StringInspector extends React.Component<any, any> {

        render() {
            return <div>
                {this.props.field.name}
                <input type="text" className="pt-input pt-small" defaultValue={this.props.field.value}/>
            </div>
        }

    },
    number: class NumberInspector extends React.Component<any, any> {

        render() {
            return <div>
                <NumericInput buttonPosition={Position.RIGHT}/>
            </div>
        }

    }
};
