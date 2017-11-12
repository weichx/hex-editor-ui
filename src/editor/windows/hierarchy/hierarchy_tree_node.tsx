import * as React from "react";
import {Classes, Collapse, ContextMenuTarget, Icon, Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {Entity} from "../../../runtime/entity";
import {AppEvent, HexAppEvent} from "../../../runtime/event";
import {Evt_EntityChildAdded} from "../../events/evt_entity_child_added";
import {Evt_EditorSelectionChanged} from "../../events/evt_editor_selection_changed";
import {EditorActions, EditorState, EntityPath} from "../../editor_actions";
import {StateTreeNode} from "../../../state_tree/state_tree_node";

export interface ITreeNodeProps {
    entity : Entity;
    key : number;
}

interface IHierarchyTreeNodeState {
    label : string;
    entity : Entity;
    childList : Array<Entity>;
    isSelected : boolean;
    isExpanded : boolean
}


@ContextMenuTarget
export class HierarchyTreeNode extends React.Component<ITreeNodeProps, IHierarchyTreeNodeState> {

    constructor(props : ITreeNodeProps) {
        super(props);
        this.state = {
            isExpanded: false,
            isSelected: false,
            entity: this.props.entity,
            label: this.props.entity.name,
            childList: this.props.entity.children.clone()
        };
        //DataSource.bind("path", handler);
        //DataSource.getValueAt<Entity>("entities/0/children/");

        //DataSource.getRef("entities/0/children").onChange(this.handler);
        //StateTree.getRef("/selection").onValueChanged(this, this.onEditorSelectionChanged);
        //AppEvent.addListener(Evt_EditorSelectionChanged, this, this.onEditorSelectionChanged);
        //AppEvent.addListener(Evt_EntityChildAdded, this, this.onChildAdded);
        //addKeyListener("/entities/id/")
        //InputEvent.addListener(DragStart, "element-id", this.method);
        //EditorState.addListener(Evt_EntityChildListChanged(id), this, this.fn);
        //this.fn = () => this.setState(childList: this.entity.children.clone());
        EditorState.getRef(EntityPath(this.props.entity.id, "isSelected")).onValueChanged(this.onEntitySelected);
        //const contentBoxRef = StateTree.get(this.entity, "boundingBox");
        //const contentBoxRef = this.entity.boundingBox;
    }

    private onEntitySelected = (ref : StateTreeNode) => {
        this.setState({isSelected: ref.getValue<boolean>()});
    };

    public componentWillUnmount() {
        AppEvent.removeListener(Evt_EntityChildAdded, this, this.onChildAdded);
    }

    protected onChildAdded(evt : Evt_EntityChildAdded) : void {
        if (evt.entity.id !== this.props.entity.id) return;
        this.setState({ childList: this.props.entity.children.clone() });
    }

    protected onChildRemoved() : void {}

    protected onChildMoved() : void {}

    protected onChildParentChanged() : void {
        this.setState({ childList: this.props.entity.children.clone() });
    }

    public render() {
        const entity = this.props.entity;
        const isExpanded = this.state.isExpanded || entity.depth === 0;
        const isSelected = this.state.isSelected;
        const showCaret = entity.depth === 0 ? false : entity.childCount > 0;
        const caretClass = showCaret ? Classes.TREE_NODE_CARET : Classes.TREE_NODE_CARET_NONE;
        const caretStateClass = isExpanded ? Classes.TREE_NODE_CARET_OPEN : Classes.TREE_NODE_CARET_CLOSED;
        const caretClasses = caretClass + " " + Classes.ICON_STANDARD + ((showCaret) ? " " + caretStateClass : "");

        const classes = Classes.TREE_NODE +
            ((isSelected) ? " " + Classes.TREE_NODE_SELECTED : "") +
            ((isExpanded) ? " " + Classes.TREE_NODE_EXPANDED : "");

        const contentClasses = Classes.TREE_NODE_CONTENT + ` pt-tree-node-content-${entity.depth}`;

        return <li data-drag-responder className={classes}>
            <div className={contentClasses}>
                <span className={caretClasses} onClick={showCaret ? this.handleCaretClick : null}/>
                <div style={ {width: "100%"}} onClick={this.handleSelect}>
                    <Icon data-thing className={Classes.TREE_NODE_ICON} iconName={"pt-icon-add"}/>
                    <span className={Classes.TREE_NODE_LABEL}>{entity.name}</span>
                </div>
                {this.maybeRenderSecondaryLabel()}
            </div>
            {this.renderCollapse()}
        </li>;
    }

    public renderContextMenu() : JSX.Element {
        return <Menu>
            <MenuItem text="Copy"/>
            <MenuItem text="Paste"/>
            <MenuDivider/>
            <MenuItem text="Rename"/>
            <MenuItem text="Duplicate"/>
            <MenuItem text="Delete"/>
            <MenuDivider/>
            <MenuItem text="Create Empty" onClick={this.handleCreateEmpty}/>
        </Menu>
    }

    private renderCollapse() {
        const entity = this.props.entity;
        if (entity.children.length > 0) {
            return <Collapse isOpen={this.state.isExpanded || entity.depth === 0}>
                <ul className={Classes.TREE_NODE_LIST}>
                    {this.renderChildren()}
                </ul>
            </Collapse>
        }
        return void 0;
    }

    private renderChildren() {
        const children = this.state.childList;
        const retn = new Array<JSX.Element>(children.length);
        for (var i = 0; i < children.length; i++) {
            retn[i] = <HierarchyTreeNode key={children[i].id as integer} entity={children[i]}/>;
        }

        return retn;
    }

    private maybeRenderSecondaryLabel() {
        // if (this.props.secondaryLabel != null) {
        //     return <span className={Classes.TREE_NODE_SECONDARY_LABEL}>{this.props.secondaryLabel}</span>;
        // } else {
        //     return undefined;
        // }
    }

    private handleSelect = () => {
        EditorActions.setSelection(this.props.entity);
    };

    private handleCaretClick = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    };

    private handleCreateEmpty = () => {
        EditorActions.createEntity(this.props.entity);
    };

}