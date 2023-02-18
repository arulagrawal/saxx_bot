import { SlashCommandBuilder } from "@discordjs/builders";
import { getTimeSpentToday } from "../database/event";
import { Command } from "../interfaces/command";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

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
    run: async (interaction) => {
        await interaction.deferReply();
        const user = interaction.options.getUser("user", true);

        if (user.id) {
            const timeSpentInMilliseconds = await getTimeSpentToday(user.id);
            console.log(`timespent: ${timeSpentInMilliseconds}`)
            if (!timeSpentInMilliseconds || timeSpentInMilliseconds == 0) {
                await interaction.editReply(`${user.username} has not spent any time in voice channels today.`)
                return
            }
            await interaction.editReply(`${user.username} has spent ${dayjs.duration(timeSpentInMilliseconds).humanize()} in voice channels today.`);
        }
        else {
            await interaction.editReply("something went wrong getting your input :(")
        }
    }
};