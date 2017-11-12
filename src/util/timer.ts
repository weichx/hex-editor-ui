import {MathUtil} from "../math/math_util";
export class Timer {

    private startTime : number;
    private timeout : number;

    constructor(timeout = -1) {
        this.startTime = Timer.elapsedTime;
        this.timeout = timeout;
    }

    public reset(timeout : number) : void {
        this.timeout = timeout;
        this.startTime = Timer.getTimeStamp();
    }

    public ready() : boolean {
        return this.timeout >= 0 && Timer.elapsedTime - this.startTime > this.timeout;
    }

    public getCompletionPercentage() : number {
        if (this.timeout <= 0) return 0;
        return MathUtil.clamp01((Timer.elapsedTime - this.startTime) / this.timeout);
    }

    public getRemainingTime() : number {
        if (this.timeout <= 0) return 0;
        return this.timeout - (Timer.elapsedTime - this.startTime);
    }

    public readyAndReset(time = -1) {
        if (this.ready()) {
            this.reset(time);
            return true;
        }
        return false;
    }

    private static elapsedTime = 0;

    public static Tick(elapsedTime : number) : void {
        Timer.elapsedTime = elapsedTime;
    }

    public static getTimeStamp() : number {
        return Timer.elapsedTime;
    }
}
//
// public class Timer {
//
//     private float startTime;
//     private float timeout;
//
//     private static float TotalElapsedTime = 0;
//
//     public static void Tick(float deltaTime) {
//     TotalElapsedTime += deltaTime;
// }
//
// public Timer() : this(-1) { }
//
// public Timer(float timeout) {
//     this.timeout = timeout;
//     startTime = TotalElapsedTime;
// }
//
// public bool ReadyWithReset(float resetTimeout = -1) {
//     if (Ready) {
//         Reset((resetTimeout >= 0) ? resetTimeout : timeout);
//         return true;
//     }
//     else {
//         return false;
//     }
// }
//
// public void Reset(float timeout = -1) {
//     this.timeout = timeout;
//     startTime = TotalElapsedTime;
// }
//
// public bool Ready {
//     get { return timeout >= 0f && TotalElapsedTime - startTime > timeout; }
// }
//
// public float CompletedPercent {
//     get {
//         if (timeout <= 0) return 0;
//         return UnityEngine.Mathf.Clamp((TotalElapsedTime - startTime) / timeout, 0, float.MaxValue);
//     }
// }
//
// public float TimeToReady {
//     get {
//         if (timeout <= 0) return 0;
//         return timeout - (TotalElapsedTime - startTime);
//     }
// }
//
// public float Timeout {
//     get { return timeout; }
//     set { timeout = value; }
// }
//
// public float ElapsedTime {
//     get { return TotalElapsedTime - startTime; }
// }
//
// public float Timestamp {
//     get { return ElapsedTime; }
// }
//
// public static float GetTimestamp {
//     get {
//         return TotalElapsedTime;
//     }
// }
// }