
export function GetHashCode(input : string) : integer {
    var hash = 0;
    const length = input.length;
    for (var i = 0; i < length; i++) {
        hash  = (((hash << 5) - hash) + input.charCodeAt(i)) | 0;
    }
    return hash;
}