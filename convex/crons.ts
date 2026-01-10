import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Sync credits every 5 minutes
crons.interval("sync user credits", { minutes: 5 }, internal.credits.syncAllCredits, {});

export default crons;
