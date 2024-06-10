import { SlashCommandBuilder } from "@discordjs/builders";
import { getTimeSpentToday } from "../database/event";
import { time_range } from "../enums/timeRanges";
import { Command } from "../interfaces/command";
import { formatNoTimeMessage, formatTimeMessage } from "../utils/formatter";
import { ChatInputCommandInteraction } from "discord.js";

export const todayForUser: Command = {
    data: new SlashCommandBuilder()
        .setName("today")
        .setDescription("Check the time spent today for a given user.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to check for.")
                .setRequired(true)
        ),
    run: async (interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply();
        const user = interaction.options.getUser("user", true);

        if (user.id) {
            const timeSpentInMilliseconds = await getTimeSpentToday(user.id);
            console.log(`timespent: ${timeSpentInMilliseconds}`)
            if (!timeSpentInMilliseconds || timeSpentInMilliseconds == 0) {
                await interaction.editReply(formatNoTimeMessage(user.username, time_range.today));
                return
            }
            await interaction.editReply(formatTimeMessage(user.username, timeSpentInMilliseconds, time_range.today));
        }
        else {
            await interaction.editReply("something went wrong getting your input :(")
        }
    }
};