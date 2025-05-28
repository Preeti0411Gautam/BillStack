import cron from "node-cron";
import { notifyUsersOfTodayBills } from "../services/notificationService.js";

export const startBillNotifier = () => {
  cron.schedule("0 5,21 * * *", async () => {
    console.log("⏰ Running bill notifier at 5 AM and 9 PM...");
    await notifyUsersOfTodayBills();
  });
};
