import { Client } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import { onInteraction } from "./events/newInteraction";
import { onReady } from "./events/onReady";
import { onVoiceUpdate } from "./events/voiceUpdate";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  if (!validateEnv()) return;
  const BOT = new Client({ intents: IntentOptions });

  BOT.on("ready", async () => await onReady(BOT));

  BOT.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction)
  );

  BOT.on("voiceStateUpdate", async (oldState, newState) => {
    await onVoiceUpdate(oldState, newState);
  });


  await BOT.login(process.env.BOT_TOKEN);
})();
