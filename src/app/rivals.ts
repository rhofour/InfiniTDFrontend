export interface RivalData {
    name: string,
    wave: number[],
    accumulatedGold: number,
    // The gold per minute the displayed user gets from their battle with this rival.
    battleGoldPerMinute?: number,
    // The gold per minute this rival is currently getting.
    rivalGoldPerMinuteTotal?: number,
}
export interface Rivals {
    aheadRivals: RivalData[],
    behindRivals: RivalData[],
}
export interface RivalNames {
    aheadNames: string[],
    behindNames: string[],
}