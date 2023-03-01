export const validateEnv = () => {
    if (!process.env.BOT_TOKEN) {
        console.warn("Missing Discord bot token.");
        return false;
    }

    if (!process.env.GUILD_ID) {
        console.warn("Missing Guild ID.");
        return false;
    }

    if (!process.env.DATABASE_URL) {
        console.warn("Missing Database URL.");
        return false;
    }

    return true;
};