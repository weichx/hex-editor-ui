export class BackgroundImage {}

export enum BackgroundRepeat {
    Repeat,
    RepeatX,
    RepeatY,
    Space,
    Round,
    None
}

const BackgroundRepeatName : Indexable<string> = {
    [BackgroundRepeat.Repeat]: "repeat",
    [BackgroundRepeat.RepeatX]: "repeat-x",
    [BackgroundRepeat.RepeatY]: "repeat-y",
    [BackgroundRepeat.Space]: "space",
    [BackgroundRepeat.Round]: "round",
    [BackgroundRepeat.None]: "no-repeat"
};

export enum BackgroundScroll {
    ScrollWithContent,
    DoNotScroll,
    Fixed
}

const BackgroundScrollName : Indexable<string> = {
    [BackgroundScroll.ScrollWithContent]: "local",
    [BackgroundScroll.DoNotScroll]: "scroll",
    [BackgroundScroll.Fixed]: "fixed"
};

export enum BackgroundClip {
    BorderBox, PaddingBox, ContentBox
}

const BackgroundClipName : Indexable<string> = {
    [BackgroundClip.BorderBox]: "border-box",
    [BackgroundClip.PaddingBox]: "padding-box",
    [BackgroundClip.ContentBox]: "content-box"
};