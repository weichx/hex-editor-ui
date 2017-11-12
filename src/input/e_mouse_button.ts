export enum MouseButtonState {
    None = 0,
    Left = 1 << 0,
    Right = 1 << 1,
    Middle = 1 << 2,
    AnyButton = Left | Middle | Right,
    LeftOrRight = Left | Right
}