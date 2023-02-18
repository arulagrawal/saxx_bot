import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { getTotalTimeForAllUsers } from "../database/event";
import { Command } from "../interfaces/command";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const leaderboard: Command = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Find the users with the most time spent")
        .addIntegerOption((option) =>
            option
                .setName("users")
                .setDescription("The number of users to return. (default 5)")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(50)
        ),
    run: async (interaction) => {
        const numUsers = (interaction.options.get("users", false)?.value ?? 5) as number;

        console.log(numUsers);
        const embed = new EmbedBuilder()
            .setTitle("Leaderboard")
            .setDescription("The users with the most time spent in a voice channel.")
            .setTimestamp()

        const users = (await getTotalTimeForAllUsers()).sort((a, b) => b.timeSpent - a.timeSpent).splice(0, numUsers);

        embed.addFields({ name: `Top ${users.length}`, value: users.map(u => u.username).join('\n'), inline: true },
            { name: `Time Spent`, value: users.map(u => dayjs.duration(u.timeSpent).humanize()).join('\n'), inline: true });

        await interaction.reply({ embeds: [embed] });
    }
};