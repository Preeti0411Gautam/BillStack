import dayjs from "dayjs";
import Bill from "../models/billModel.js";
import User from "../models/userModel.js";
import transporter from "./mailer.js";

export const dueDateReminders = async () => {
  try {
    const today = dayjs().startOf("day");
    const fourDaysLater = dayjs().add(4, "day").endOf("day");

    // Get unpaid bills due today, overdue, or due in next 4 days
    const bills = await Bill.find({
      dueDate: { $lte: fourDaysLater.toDate() },
      paymentStatus: false,
    });

    for (const bill of bills) {
      const user = await User.findById(bill.userId);
      if (!user?.email) {
        console.warn(`No email for user ID: ${bill.userId}`);
        continue;
      }

      const daysLeft = dayjs(bill.dueDate).diff(today, "day");
      const formattedDate = dayjs(bill.dueDate).format("DD MMM YYYY");

      // Generate timing text based on due status
      let timingText = "";
      if (daysLeft > 0) {
        timingText = `is due in <strong>${daysLeft} day${daysLeft > 1 ? "s" : ""}</strong>, on <strong>${formattedDate}</strong>`;
      } else if (daysLeft === 0) {
        timingText = `is <strong>due today</strong> (<strong>${formattedDate}</strong>)`;
      } else {
        timingText = `was due <strong>${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? "s" : ""} ago</strong>, on <strong>${formattedDate}</strong>`;
      }

      const mailOptions = {
        from: `"BillStack" <${process.env.NOTIFY_EMAIL}>`,
        to: user.email,
        subject: `Reminder: Your ${bill.billType} Bill ${daysLeft < 0 ? "Was Due" : "is Due"} on ${formattedDate}`,
        html: `
        <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 30px;">
            <h2 style="color: #007bff; font-size: 24px; margin-bottom: 20px;">🔔 Bill Payment Reminder</h2>
            <p style="font-size: 16px;">Dear <strong>${user.name || "Valued Customer"}</strong>,</p>
            <p style="font-size: 16px;">We hope you're doing well! This is a friendly reminder that your <strong>${bill.billType}</strong> bill of <strong>₹${bill.amount}</strong> ${timingText}.</p>
            <p style="font-size: 16px;">To avoid any late fees or disruptions in service, we encourage you to complete the payment as soon as possible.</p>
            <div style="margin: 30px 0; padding: 15px; background-color: #e9f5ff; border-left: 4px solid #007bff; border-radius: 4px;">
              <p style="margin: 0; font-size: 16px;"><strong>Due Date:</strong> ${formattedDate}</p>
              <p style="margin: 0; font-size: 16px;"><strong>Amount:</strong> ₹${bill.amount}</p>
              <p style="margin: 0; font-size: 16px;"><strong>Bill Type:</strong> ${bill.billType}</p>
            </div>
            <p style="font-size: 16px;">Thank you for using <strong>BillStack</strong> to manage your bills.</p>
            <p style="font-size: 16px; margin-top: 40px;">Best regards,<br><strong>The BillStack Team</strong></p>
          </div>
        </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email} (daysLeft: ${daysLeft})`);
      } catch (err) {
        console.error(`Email failed for ${user.email}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Error in dueDateReminders:", err.message);
  }
};
