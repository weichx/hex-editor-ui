import {Entity} from "../../../runtime/entity";
import {ITreeNode} from "@blueprintjs/core";

class HierarchyNode implements ITreeNode {

    public isExpanded : boolean;
    public isSelected : boolean;

    public readonly entity : Entity;

    constructor(entity : Entity) {
        this.entity = entity;
    }

    get label() : string {
        return this.entity.name;
    }

    get id() : number {
        return this.entity.id as integer;
    }

    get hasCaret() : boolean {
        return this.entity.childCount > 0;
    }

    get childNodes() : Array<HierarchyNode> {
        return [];
    }

}

/*

Undo/Redo
Serialization
Maintain references

Probably want all communication to go through events

new Evt_EntityCreated()

onEntityCreated(evt) {
    store.entities.push(evt.entity);

}

 */