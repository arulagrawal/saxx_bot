import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { time_range } from "../enums/timeRanges";
import { time } from "../interfaces/time";

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const formatNoTimeMessage = (user: string, time: time_range) => {
    return `${user} has not spent any time in voice channels${getEndString(time)}`;
}

export const formatTimeMessage = (user: string, time_spent: number, time: time_range) => {
    const duration = millisecondsToHumanTime(time_spent);
    return `${user} has spent ${duration} in voice channels${getEndString(time)}`;
}

export const formatLeaderBoard = (users: time[]) => {
    return [{ name: `Top ${users.length}`, value: users.map(u => u.username).join('\n'), inline: true },
    { name: `Time Spent`, value: users.map(u => millisecondsToHumanTime(u.timeSpent)).join('\n'), inline: true }] as const;
}

const millisecondsToHumanTime = (ms: number) => {
    return dayjs.duration(ms).humanize();
}

const getEndString = (time: time_range) => {
    if (time == time_range.today) {
        return " today.";
    } else if (time == time_range.total) {
        return ".";
    }
    else {
        return ` this ${time}.`;
    }
}