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
            const timeSpentInMilliseconds = await getTimeSpentTotal(text.value as string);
            console.log(`timespent: ${timeSpentInMilliseconds}`)
            if (!timeSpentInMilliseconds || timeSpentInMilliseconds == 0) {
                await interaction.editReply(`${text.value as string} has not spent any time in text channels.`)
                return
            }
            await interaction.editReply(dayjs.duration(timeSpentInMilliseconds).humanize());

        }
        else {
            await interaction.editReply("something went wrong getting your input :(")
        }
    }
};