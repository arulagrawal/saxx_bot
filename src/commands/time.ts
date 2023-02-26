import { SlashCommandBuilder } from "@discordjs/builders";
import { getTimeSpentInTimeRange, getTimeSpentToday } from "../database/event";
import { Command } from "../interfaces/command";
import { formatNoTimeMessage, formatTimeMessage } from "../utils/formatter";
import { time_range } from "../enums/timeRanges"

export const timeForUser: Command = {
    data: new SlashCommandBuilder()
        .setName("time")
        .setDescription("Check the time spent in a given time period for a given user.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to check for.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setRequired(true)
                .setDescription("select a time period here")
                .setChoices(
                    {name: "today", value: "today"},
                    {name: "week", value: "week"},
                    {name: "month", value: "month"},
                    {name: "year", value: "year"},
                    {name: "total", value: "total"}
                )
        ),
    run: async (interaction) => {
        await interaction.deferReply();
        const user = interaction.options.getUser("user", true);
        const time = interaction.options.get("time", true);

        if (user.id && time.value) {
            const _time = time.value as keyof typeof time_range;
            const e = time_range[_time];
            const timeSpentInMilliseconds = await getTimeSpentInTimeRange(user.id, e);
            console.log(`timespent: ${timeSpentInMilliseconds}`)
            if (!timeSpentInMilliseconds || timeSpentInMilliseconds == 0) {
                await interaction.editReply(formatNoTimeMessage(user.username, e));
                return
            }
            await interaction.editReply(formatTimeMessage(user.username, timeSpentInMilliseconds, e));
        }
        else {
            await interaction.editReply("something went wrong getting your input :(")
        }
    }
};