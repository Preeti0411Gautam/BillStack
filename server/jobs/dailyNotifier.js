import cron from "node-cron";
import { sendBillReminder } from "../services/uploadBillReminder.js";
import { notifyUsersOfTodayBills } from "../services/notificationService.js";
export const startBillNotifier = () => {
  cron.schedule("0 5,21 * * *", async () => {
    console.log("⏰ Running bill notifier at 5 AM and 9 PM...");
    await notifyUsersOfTodayBills();
  });
};


export const uploadBillNotifer =()=>{
  cron.schedule('0 9 * * *', async () => {
  console.log("Running daily bill reminder check at 9 AM...");
  await sendBillReminder();
});
}
