import { Command } from "../interfaces/command";
import { leaderboard } from "./leaderboard";
import { timeForUser } from "./time";
import { todayForUser } from "./todayforUser";
import { totalForUser } from "./totalforUser";

export const CommandList: Command[] = [totalForUser, todayForUser, leaderboard, timeForUser];