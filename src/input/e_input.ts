export const enum InputEventType {
    MouseDown = 1 << 0,
    MouseUp = 1 << 1,
    MouseMove = 1 << 2,
    MouseHover = 1 << 3,
    MouseEnter = 1 << 4,
    MouseExit = 1 << 5,
    MouseUpdate = MouseMove | MouseHover,

    KeyDown = 1 << 6,
    KeyUp = 1 << 7,
    KeyPress = 1 << 8,

    DragStart = 1 << 9,
    DragEnd = 1 << 10,
    DragMove = 1 << 11,
    DragHover = 1 << 12,
    DragEnter = 1 << 13,
    DragExit = 1 << 14,
    DragDrop = 1 << 15,
    DragCancel = 1 << 16,
    DragUpdate = DragMove | DragHover,

    ScrollStart = 1 << 17,
    ScrollUpdate = 1 << 18,
    ScrollEnd = 1 << 19,
    Scroll = ScrollStart | ScrollEnd | ScrollUpdate
}

export const enum MouseEventType {
    MouseDown = 1 << 0,
    MouseUp = 1 << 1,
    MouseMove = 1 << 2,
    MouseHover = 1 << 3,
    MouseEnter = 1 << 4,
    MouseExit = 1 << 5,
    MouseUpdate = MouseMove | MouseHover
}

export const enum ScrollEventType {
    ScrollStart = 1 << 17,
    ScrollUpdate = 1 << 18,
    ScrollEnd = 1 << 19,
    Scroll = ScrollStart | ScrollEnd | ScrollUpdate
}

export const enum KeyEventType {
    KeyDown = 1 << 6,
    KeyUp = 1 << 7,
    KeyPress = 1 << 8
}

export const enum DragEventType {
    DragStart = 1 << 9,
    DragEnd = 1 << 10,
    DragMove = 1 << 11,
    DragHover = 1 << 12,
    DragEnter = 1 << 13,
    DragExit = 1 << 14,
    DragDrop = 1 << 15,
    DragCancel = 1 << 16,
    DragUpdate = DragMove | DragHover
}