import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { getTimeSpentTotal } from "../database/event";
import { Command } from "../interfaces/command";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const totalForUser: Command = {
    data: new SlashCommandBuilder()
        .setName("total")
        .setDescription("Check the total time spent for a given user.")
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
            const timeSpentInMilliseconds = await getTimeSpentTotal(user.id);
            console.log(`timespent: ${timeSpentInMilliseconds}`)
            if (!timeSpentInMilliseconds || timeSpentInMilliseconds == 0) {
                await interaction.editReply(`${user.username} has not spent any time in voice channels.`)
                return
            }
            await interaction.editReply(`${user.username} has spent ${dayjs.duration(timeSpentInMilliseconds).humanize()} in voice channels.`);

        }
        else {
            await interaction.editReply("something went wrong getting your input :(")
        }
    }
};