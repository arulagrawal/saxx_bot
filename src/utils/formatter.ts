import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { time_range } from "../enums/timeRanges";

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const formatNoTimeMessage = (user: string, time: time_range) => {
    return `${user} has not spent any time in voice channels${getEndString(time)}`;
}

export const formatTimeMessage = (user: string, time_spent: number, time: time_range) => {
    const duration = dayjs.duration(time_spent).humanize();
    return `${user} has spent ${duration} in voice channels${getEndString(time)}`;
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