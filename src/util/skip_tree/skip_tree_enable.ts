// import {IPoolable1} from "../pool";
// import {Entity} from "../../runtime/entity";
// import {SkipTreeNode} from "../skip_tree2";
// import {Component, ComponentFlag} from "../../runtime/component";
// import {LinkedList} from "../linked_list";
//
// export class EnableSkipTreeNode implements IPoolable1<Entity> {
//
//     public entity : Entity;
//     public readonly children : LinkedList<SkipTreeNode>;
//     private readonly components : LinkedList<Component>;
//
//     constructor() {
//         this.entity = null;
//         this.children = new LinkedList<SkipTreeNode>();
//         this.components = new LinkedList<Component>();
//     }
//
//     public traverse(arg : any) : boolean {
//
//         if (!this.entity.getActive()) {
//             return false;
//         }
//
//         var ptr = this.components.getFirst();
//
//         this.components.forEach(this.traverseFn);
//
//         for(let i = 0; i < this.components.length; i++) {
//             const component = this.components[i];
//             if(__inline_isBitSet(component.flags, ComponentFlag.Enabled)) {
//                 component.awake();
//                 this.components.removeAt(i--);
//             }
//         }
//
//         for(let i = 0; i < this.children.length; i++) {
//             if(this.children[i].traverse(arg)) {
//                 this.children.removeAt(i--);
//             }
//         }
//
//         return this.components.length === 0;
//     }
//
//     public add(component : Component) : void {
//         if(__inline_isBitSet(component.flags, ComponentFlag.Start)) return;
//         this.components.push(component);
//     }
//
//     public remove(component : Component) : void {
//
//     }
//
//     public insert(component : Component) {
//
//     }
//
//     public onSpawn(entity : Entity) : void {
//         this.entity = entity;
//     }
//
//     public onDespawn() : void {}
//
// }
