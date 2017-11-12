import * as React from "react";
import {Classes} from "@blueprintjs/core";
import {HierarchyTreeNode} from "./hierarchy_tree_node";
import {Entity} from "../../../runtime/entity";

export interface IHierarchyTreeProps {
    rootEntity : Entity;
}

export class HierarchyTree extends React.Component<IHierarchyTreeProps, {}> {

    public render() {
        return (
            <div className={Classes.TREE}>
                <ul className={Classes.TREE_NODE_LIST + " " + Classes.TREE_ROOT}>
                    <HierarchyTreeNode key={this.props.rootEntity.id as integer} entity={this.props.rootEntity}/>
                </ul>
            </div>
        );
    }

}
