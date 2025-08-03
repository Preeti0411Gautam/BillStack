import dayjs from "dayjs";
import Bill from "../models/billModel.js";
import User from "../models/userModel.js";
import transporter from "./mailer.js";

const EXPECTED_DATE = 10; // Bills expected by 10th day of month

export const sendBillReminder = async () => {
  try {
    const today = dayjs();
    const thisMonth = today.month(); // 0-indexed
    const thisYear = today.year();
    const expectedDate = dayjs()
      .year(thisYear)
      .month(thisMonth)
      .date(EXPECTED_DATE);

    const users = await User.find();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      if (!user.billPreferences || user.billPreferences.length === 0) {
        console.log(`Skipping user ${user.email} - no preferred bill types`);
        continue;
      }
      console.log(
        `Checking preferred bills for ${user.email}:`,
        user.billPreferences
      );

      for (const billType of user.billPreferences) {
        const startOfMonth = dayjs().startOf("month").toDate();
        const endOfMonth = dayjs().endOf("month").toDate();

        const billExists = await Bill.exists({
          userId: user._id,
          billType,
          billGeneratedDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        });

        if (!billExists && user.email) {
          const mailOptions = {
            from: `"BillStack" <${process.env.NOTIFY_EMAIL}>`,
            to: user.email,
            subject: `Reminder: Your ${billType} bill for ${expectedDate.format(
              "MMMM YYYY"
            )} is due`,
            // Updated email message for a more professional tone
            html: `<div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 30px;">
    <h2 style="color: #007bff; font-size: 24px; margin-bottom: 20px;">📥 Bill Upload Reminder</h2>
    
    <p style="font-size: 16px;">Dear <strong>${
      user.name || "Valued Customer"
    }</strong>,</p>
    
    <p style="font-size: 16px;">
      We noticed that your <strong>${billType}</strong> bill for <strong>${expectedDate.format(
              "MMMM YYYY"
            )}</strong> hasn't been uploaded yet to your <strong>BillStack</strong> account.
    </p>
    
    <p style="font-size: 16px;">
      Keeping your bills organized ensures your expense tracking and analytics stay accurate and up to date.
    </p>
    
    <div style="margin: 30px 0; padding: 15px; background-color: #e9f5ff; border-left: 4px solid #007bff; border-radius: 4px;">
      <p style="margin: 0; font-size: 16px;"><strong>Pending Bill Type:</strong> ${billType}</p>
      <p style="margin: 0; font-size: 16px;"><strong>Billing Month:</strong> ${expectedDate.format(
        "MMMM YYYY"
      )}</p>
    </div>
    
    <p style="font-size: 16px;">
      Please log in to your account and upload the bill at your earliest convenience.
    </p>
    
    <p style="font-size: 16px; margin-top: 40px;">
      Thank you for staying organized with <strong>BillStack</strong>.
    </p>
    
    <p style="font-size: 16px;">Best regards,<br><strong>The BillStack Team</strong></p>
  </div>
</div>
`,
          };

          try {
            await transporter.sendMail(mailOptions);
            console.log(`Reminder sent to ${user.email} for ${billType}`);
          } catch (err) {
            console.error(`Email failed to ${user.email}:`, err.message);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in sendBillReminder:", error);
  }
};
