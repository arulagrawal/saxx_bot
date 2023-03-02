import { VoiceState } from "discord.js";
import { createSession, updateSession } from "../database/event";

export const onVoiceUpdate = async (oldState: VoiceState, newState: VoiceState) => {
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;

    const username = newState.member?.user?.username as string;
    const snowflake = newState.member?.user?.id as string;

    const afkChannelID = newState.guild.afkChannelId;

    if (oldUserChannel === null && newUserChannel !== null) {
        // if the user joins the afk channel directly, don't do anything
        if (newUserChannel.id == afkChannelID) {
            return;
        }

        const session = createSession(snowflake, username, new Date());
    } else if (oldUserChannel !== null && newUserChannel === null) {
        // if the user leaves the afk channel, don't do anything
        if (oldUserChannel.id == afkChannelID) {
            return;
        }

        const session = updateSession(snowflake, new Date());
    } else if (
        oldUserChannel !== null &&
        newUserChannel !== null &&
        oldUserChannel.id != newUserChannel.id
    ) {
        if (newUserChannel.id == afkChannelID) {
            // if the user goes to the AFK channel, end the session
            const session = updateSession(snowflake, new Date());
        } else if (oldUserChannel.id == afkChannelID) {
            // if the user leaves the afk channel, create a session.
            const session = createSession(snowflake, username, new Date());
        }
        console.log(`${username} switched channels`)
    }
}
