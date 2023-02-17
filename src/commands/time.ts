import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../interfaces/command";

export const time: Command = {
    data: new SlashCommandBuilder()
    .setName("100")
    .setDescription("Check in for the 100 Days of Code challenge.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to go in your 100 Days of Code update.")
        .setRequired(true)
    ),
    run: async (interaction) => {
        await interaction.deferReply();
        const { user } = interaction;
        const text = interaction.options.get("message", true);
        console.log(`the user typed in ${text.value}`);

        await interaction.editReply("text");
    }  
};