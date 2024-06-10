const MS_DAYS = 8.64e7,
    MS_HOURS = 3.6e6,
    MS_MINUTES = 6e4,
    MS_SECONDS = 1e3;

interface time {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const defaultDuration: time = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const divmod = (n: number, m: number) => [Math.trunc(n / m), n % m];

const fromMillis = (durationMs: number): time => {
    const [days, daysMs] = divmod(durationMs, MS_DAYS);
    const [hours, hoursMs] = divmod(daysMs, MS_HOURS);
    const [minutes, minutesMs] = divmod(hoursMs, MS_MINUTES);
    const seconds = Math.trunc(minutesMs / MS_SECONDS);
    return { days, hours, minutes, seconds };
};

const formatDuration = (duration: time, includeAll: boolean) => {
    const d = { ...defaultDuration, ...duration };
    return [
        { count: d.days, text: `${d.days}d` },
        { count: d.hours, text: `${d.hours}h` },
        { count: d.minutes, text: `${d.minutes}m` },
        { count: d.seconds, text: `${d.seconds}s` },
    ]
        .filter((t) => includeAll || t.count > 0)
        .map((t) => t.text)
        .join(" ");
};

export const formatDurationFromMillis = (
    durationMs: number,
    includeAll: boolean
) => formatDuration(fromMillis(durationMs), includeAll);