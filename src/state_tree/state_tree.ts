import {StateTreeNode} from "./state_tree_node";


export class StateTree {

    private refMap : Map<string, StateTreeNode>;
    private lastPushTime : integer;
    private lastRandChars : Array<integer>;

    constructor() {
        this.refMap = new Map<string, StateTreeNode>();
        this.lastRandChars = [];
    }

    public getRefWithKey(path : string, key : string) : StateTreeNode {
        if (!key && (path === "" || path === "/")) return null;
        const fullPath = path + "/" + key;
        const parentPath = path;
        var ref = this.refMap.get(fullPath);

        if (ref === void 0) {
            ref = new StateTreeNode(this, parentPath, key);
            this.refMap.set(fullPath, ref);
        }

        return ref;
    }

    public getRef(path : string) : StateTreeNode {
        if (path === "" || path === "/") return null;
        const key = this.getKey(path);
        const parentPath = this.getParentPath(path);
        const fullPath = path;

        var ref = this.refMap.get(fullPath);

        if (ref === void 0) {
            ref = new StateTreeNode(this, parentPath, key);
            this.refMap.set(fullPath, ref);
        }

        return ref;
    }

    private getParentPath(path : string) : string {
        return path.substring(0, path.lastIndexOf("/"));
    }

    private getKey(path : string) {
        const slashIdx = path.lastIndexOf("/");
        if (slashIdx === -1) {
            return path;
        }
        else {
            return path.substr(slashIdx + 1);
        }
    }

    // https://gist.github.com/mikelehen/3596a30bd69384624c11
    /** @internal */
    public generatePushId() {
        var now = Date.now();
        var duplicateTime = (now === this.lastPushTime);
        this.lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = StateTree.PushCharacters.charAt(now % 64);
            // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
            now = Math.floor(now / 64);
        }

        if (now !== 0) throw new Error('We should have converted the entire timestamp.');

        var id = timeStampChars.join('');

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                this.lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
            for (i = 11; i >= 0 && this.lastRandChars[i] === 63; i--) {
                this.lastRandChars[i] = 0;
            }
            this.lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += StateTree.PushCharacters.charAt(this.lastRandChars[i]);
        }
        if(id.length != 20) throw new Error('Length should be 20.');

        return id;
    }

    private static PushCharacters = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

}