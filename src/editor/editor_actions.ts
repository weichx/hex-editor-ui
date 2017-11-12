import {Entity} from "../runtime/entity";
import {StateTree} from "../state_tree/state_tree";


export const EditorState = new StateTree();

interface IEntityEntry {
    isSelected : boolean;
}

interface IEditorState {
    selection : Map<string, any>;
    entities: Map<number, IEntityEntry>;
}
//tree = new TypedStateTree<IEditorState>(EditorStateDef);
//tree.set(EntityTable, i, key);

class EntityTable {
    static path = "/entities";
    selection : boolean;
    nested: EntityTable;
}

export function EntityPath(id : EntityId, key : keyof IEntityEntry) : string {
    return "/entities/" + id.toString() + "/" + key;
}

// function getTypedRef<T>(type : INewable<T>, id : number, field : keyof T)

export class EditorActions {

    public static setSelection(entity : Entity) {

        const selection = EditorState.getRef("/selection");
        const selectedIds = selection.getValue<number[]>();

        if(selectedIds) {
            EditorState.getRef(EntityPath(selectedIds[0], "isSelected")).set(false);
        }

        selection.set({ 0: entity.id });
        EditorState.getRef(EntityPath(entity.id, "isSelected")).set(true);

    }

    public static createEntity(parent : Entity = null) {
        const entity = new Entity("Entity", parent);
        // EditorState.getRef(EntityPath(entity.id)).set(new EntityEntry(entity));
    }
}

/*
entity_child_added -> undo

mapStateToProps(state) {
    isSelected: state.selection === this.props.id
}

 */

