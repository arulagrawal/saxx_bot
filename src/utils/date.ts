// credit to https://stackoverflow.com/questions/8528382/javascript-show-milliseconds-as-dayshoursmins-without-seconds#comment130056877_27065690
// modified a bit for ts

const
    MS_DAYS = 8.64e7,
    MS_HOURS = 3.6e6,
    MS_MINUTES = 6e4,
    MS_SECONDS = 1e3;

type duration = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

const defaultDuration: duration = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const pluralize = (text: string, count = 1, suffix = 's') =>
    count === 1 ? text : `${text}${suffix}`

const divmod = (n: number, m: number) => [Math.trunc(n / m), n % m];

const fromMillis = (durationMs: number) => {
    const [days, daysMs] = divmod(durationMs, MS_DAYS);
    const [hours, hoursMs] = divmod(daysMs, MS_HOURS);
    const [minutes, minutesMs] = divmod(hoursMs, MS_MINUTES);
    const seconds = minutesMs / MS_SECONDS;
    return { days, hours, minutes, seconds };
};

const formatDuration = (duration: duration, includeAll: boolean) => {
    const d = { ...defaultDuration, ...duration };
    return [
        { count: d.days, text: `${d.days} ${pluralize('day', d.days)}` },
        { count: d.hours, text: `${d.hours} ${pluralize('hour', d.hours)}` },
        { count: d.minutes, text: `${d.minutes} ${pluralize('minute', d.minutes)}` },
        { count: d.seconds, text: `${d.seconds} ${pluralize('second', d.seconds)}` }
    ]
        .filter(({ count }) => includeAll || count > 0)
        .map(({ text }) => text)
        .join(' ');
};

export const formatDurationFromMillis = (durationMs: number, includeAll = false) =>
    formatDuration(fromMillis(durationMs), includeAll);