export function debugBreak() {
    if ((window as any).nw !== void 0) {
        nw.Window.get().showDevTools();
    }
    debugger;
}