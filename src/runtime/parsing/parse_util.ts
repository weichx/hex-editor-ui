
export function isUnitPart(input : string) : boolean {
    return input === "%" || input === "p" || input === "x";
}

export function isUnit(input : string) : boolean {
    return input === "px" || input === "%";
}

export function isNumber(digit : string) {
    return digit === "1"
        || digit === "2"
        || digit === "3"
        || digit === "4"
        || digit === "5"
        || digit === "6"
        || digit === "7"
        || digit === "8"
        || digit === "9"
        || digit === "0"
        || digit === "."
        || digit === "-"
}

export function isWhiteSpace(char : string) : boolean {
    return (char === ' ')
        || (char === '\t')
        || (char == '\n');
}