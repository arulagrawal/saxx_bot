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
            const timeSpentInMilliseconds = await getTimeSpentToday(text.value as string);
            console.log(`timespent: ${timeSpentInMilliseconds}`)
            if (!timeSpentInMilliseconds || timeSpentInMilliseconds == 0) {
                await interaction.editReply(`${text.value as string} has not spent any time in text channels today.`)
                return
            }
            await interaction.editReply(dayjs.duration(timeSpentInMilliseconds).humanize());
        }
        else {
            await interaction.editReply("something went wrong getting your input :(")
        }
    }
};