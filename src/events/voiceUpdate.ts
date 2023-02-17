import { VoiceState } from "discord.js";
import { createSession, updateSession } from "../database/event";

export const voiceUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;
    if (oldUserChannel === null && newUserChannel !== null) {
        const user = newState.member?.user?.username ?? "wtf";
        console.log(`${user} joined`);
        const date = new Date();

        const session = createSession(user, date);
        console.log(session);
    } else if (oldUserChannel !== null && newUserChannel === null) {
        const user = oldState.member?.user?.username ?? "wtf";
        console.log(`${user} left`);
        const date = new Date();

        const session = updateSession(user, date);
        console.log(session);
    } else if (
        oldUserChannel !== null &&
        newUserChannel !== null &&
        oldUserChannel.id != newUserChannel.id
    ) {
        const user = newState.member?.user?.username;
        console.log(`${user} switched channels`)
    }
}
