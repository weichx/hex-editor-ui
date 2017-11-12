export class TimeData {

    public readonly startTime : number;
    public time : number;
    public frameCount : integer;
    public scale : number;
    public lastFrameTime : number;
    public lastTimes : number[];
    public deltaTime : number;

    constructor(startTime : number) {
        this.startTime = startTime;
        this.frameCount = 0;
        this.deltaTime = 0;
        this.scale = 1;
        this.lastTimes = new Array(11);
        for(let i = 0; i < this.lastTimes.length; i++) {
            this.lastTimes[i] = 0;
        }
    }

    public update(time : number) {
        this.time = time;
        this.frameCount++;
        this.deltaTime = time - this.lastFrameTime;
        this.lastFrameTime = this.time;
    }

    public smoothTime() : void {
        var min0 = this.lastTimes[0];
        var min1 = this.lastTimes[1];

        if(min1 < min0) {
            min1 = this.lastTimes[0];
            min0 = this.lastTimes[1];
        }

        for(var i = 2; i < 11; i++) {

        }

        //if num <= min && minCount < 2
        //if num <= max && maxCount < 2

    }

}

export class Time {

    private static currentTimeData : TimeData;

    /** @internal */
    public static setTimeData(timeData : TimeData) {
        this.currentTimeData = timeData;
    }

    public static getDeltaTime() : number {
        return Time.currentTimeData.time - Time.currentTimeData.lastFrameTime;
    }

    public static getSmoothDeltaTime() : number {
        return 0;
    }

}