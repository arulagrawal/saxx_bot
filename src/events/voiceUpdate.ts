import { VoiceState } from "discord.js";
import { createSession, updateSession } from "../database/event";

export const onVoiceUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;

    if (oldUserChannel === null && newUserChannel !== null) {
        const username = newState.member?.user?.username as string;
        const snowflake = newState.member?.user?.id as string;

        const session = createSession(snowflake, username, new Date());
    } else if (oldUserChannel !== null && newUserChannel === null) {
        const snowflake = newState.member?.user?.id as string;

        const session = updateSession(snowflake, new Date());
    } else if (
        oldUserChannel !== null &&
        newUserChannel !== null &&
        oldUserChannel.id != newUserChannel.id
    ) {
        const user = newState.member?.user?.username;
        console.log(`${user} switched channels`)
    }
}
