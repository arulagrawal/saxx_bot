import { Client } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import { onInteraction } from "./events/newInteraction";
import { onReady } from "./events/onReady";

interface event {
  joinTime?: Date
  leaveTime?: Date
}

let dates: Record<string, event> = {};


(async () => {
  const BOT = new Client({ intents: IntentOptions });

  BOT.on("ready", async () => await onReady(BOT));

  BOT.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction)
  );

  BOT.on("voiceStateUpdate", async (oldState, newState) => {
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;
    if (oldUserChannel === null && newUserChannel !== null) {
      const user = newState.member?.user?.username ?? "wtf";
      console.log(`${user} joined`);
      const date = new Date();
      dates[user] = { joinTime: date };
    } else if (oldUserChannel !== null && newUserChannel === null) {
      const user = oldState.member?.user?.username ?? "wtf";
      console.log(`${user} left`);
      const date = new Date();
      dates[user].leaveTime = date;
    } else if (
      oldUserChannel !== null &&
      newUserChannel !== null &&
      oldUserChannel.id != newUserChannel.id
    ) {
      const user = newState.member?.user?.username;
      console.log(`${user} switched channels`)
    }
  });


  await BOT.login(process.env.BOT_TOKEN);
})();
