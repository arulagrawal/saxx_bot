import { SlashCommandBuilder } from "@discordjs/builders";
import { getTimeSpentTotal } from "../database/event";
import { Command } from "../interfaces/command";
import { formatDurationFromMillis } from "../utils/date";

export const totalForUser: Command = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Check the total time spent for a given user.")
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("The user you want to check for.")
                .setRequired(true)
        ),
    run: async (interaction) => {
        await interaction.deferReply();
        const text = interaction.options.get("username", true);
        
        if (text.value) {
            const timeSpentInMilliseconds = getTimeSpentTotal(text.value as string);
            await interaction.editReply(formatDurationFromMillis((await timeSpentInMilliseconds)));
        }
        else {
            await interaction.editReply("something went wrong getting your input :(")
        }
    }
};