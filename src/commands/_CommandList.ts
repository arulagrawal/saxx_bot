import { Command } from "../interfaces/command";
import { todayForUser } from "./todayforUser";
import { totalForUser } from "./totalforUser";

export const CommandList: Command[] = [totalForUser, todayForUser];