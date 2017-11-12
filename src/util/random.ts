
export function getRandomInt(min : number, max : number) {
    min = min | 0;
    max = max | 0;
    return ~~(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min : number, max : number) : number {
    return ~~(Math.random() * (max - min + 1)) + min;
}