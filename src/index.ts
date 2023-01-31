import { Client, GuildMember, Snowflake, User } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";

(async () => {
  const BOT = new Client({ intents: IntentOptions });

  BOT.on("ready", () => console.log("Connected to Discord!"));

  BOT.on("voiceStateUpdate", async (oldState, newState) => {
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;
    if (oldUserChannel === null && newUserChannel !== null) {
      const user = newState.member?.user?.username;
      console.log(`${user} joined`);
    } else if (oldUserChannel !== null && newUserChannel === null) {
      const user = oldState.member?.user?.username;
      console.log(`${user} left`);
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
