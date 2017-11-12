import {Entity} from "../runtime/entity";
export interface ICompareFunction<T> {
    (a : T, b : T) : number;
}

export interface EntityField {
    entity : Entity;
}

export interface IDepthSortable {
    parent : IDepthSortable;
    siblingIndex : number;
    depth : number;
}

export function defaultCompareFn<T>(a : T, b : T) : number {
    if (a < b) return -1;
    if (a === b) return 0;
    return 1;
}

export function inverseCompareFn<T>(a : T, b : T) : integer {
    if (a < b) return 1;
    if (a === b) return 0;
    return -1;
}

export function fastEntityDepthSort<T extends EntityField>(a : T, b : T) : integer {
    var aDepth = a .entity.depth;
    var bDepth = b.entity.depth;
    if(aDepth === bDepth) return 0;
    return aDepth > bDepth ? 1 : -1;
}

export function fastEntityInverseDepthSort<T extends EntityField>(a : T, b : T) : integer {
    var aDepth = a .entity.depth;
    var bDepth = b.entity.depth;
    if(aDepth === bDepth) return 0;
    return aDepth > bDepth ? -1 : 1;
}

export function siblingIndexSort<T extends EntityField>(a : T, b : T) : integer {
    return a.entity.siblingIndex > b.entity.siblingIndex ? 1 : -1;
}

export function inverseSiblingIndexSort<T extends EntityField>(a : T, b : T) : integer {
    return a.entity.siblingIndex > b.entity.siblingIndex ? -1 : 1;
}

export function entityTraversalSort<T extends EntityField>(a : T, b : T) : integer {
    return (a.entity.traversalIdx > b.entity.traversalIdx) ? 1 : -1;
}

export function entityDepthSort<T extends EntityField>(a : T, b : T) : integer {
    const parentA = a.entity.parent;
    const parentB = b.entity.parent;
    if (parentA.depth === parentB.depth) {
        if (parentA === parentB) {
            return a.entity.siblingIndex > b.entity.siblingIndex ? 1 : -1;
        }
        else {
            return depthSort(parentA, parentB);
        }
    }
    else {
        return parentA.depth > parentB.depth ? 1 : -1;
    }
}

export function inverseEntityDepthSort<T extends EntityField>(a : T, b : T) : integer {
    const parentA = a.entity.parent;
    const parentB = b.entity.parent;
    if (parentA.depth === parentB.depth) {
        if (parentA === parentB) {
            return a.entity.siblingIndex > b.entity.siblingIndex ? -1 : 1;
        }
        else {
            return inverseDepthSort(parentA, parentB);
        }
    }
    else {
        return parentA.depth > parentB.depth ? -1 : 1;
    }
}


export function depthSort<T extends IDepthSortable>(a : T, b : T) : integer {
    const parentA = a.parent;
    const parentB = b.parent;
    if (parentA.depth === parentB.depth) {
        if (parentA === parentB) {
            return a.siblingIndex > b.siblingIndex ? 1 : -1;
        }
        else {
            return depthSort(parentA, parentB);
        }
    }
    else {
        return parentA.depth > parentB.depth ? 1 : -1;
    }
}

export function inverseDepthSort<T extends IDepthSortable>(a : T, b : T) : integer {
    const parentA = a.parent;
    const parentB = b.parent;
    if (parentA.depth === parentB.depth) {
        if (parentA === parentB) {
            return a.siblingIndex > b.siblingIndex ? -1 : 1;
        }
        else {
            return inverseDepthSort(parentA, parentB);
        }
    }
    else {
        return parentA.depth > parentB.depth ? -1 : 1;
    }
}

export function getKeyedCompareFn<T extends object>(key : keyof T) {
    return function (a : T, b : T) : number {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue > bValue) return 1;
        if (bValue > aValue) return -1;
        return 0;
    }
}

export function getInverseKeyedCompareFn<T extends object>(key : keyof T) {
    return function (a : T, b : T) : number {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue > bValue) return -1;
        if (bValue > aValue) return 1;
        return 0;
    }
}
