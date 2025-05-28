import dayjs from 'dayjs';
import Bill from '../models/billModel.js';
import User from '../models/userModel.js';
import transporter from './mailer.js';

const EXPECTED_BILL_TYPES = ['Electricity', 'Water', 'Rent', 'Internet', 'Gas', 'Other'];
const EXPECTED_DATE = 10; // Bills expected by 10th day of month

export const sendBillReminder = async () => {
  try {
    const today = dayjs();
    const thisMonth = today.month(); // 0-indexed
    const thisYear = today.year();
    const expectedDate = dayjs().year(thisYear).month(thisMonth).date(EXPECTED_DATE);

    const users = await User.find();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`Checking user: ${user.email || user._id}`);

      for (const billType of EXPECTED_BILL_TYPES) {
        const startOfMonth = dayjs().year(thisYear).month(thisMonth).date(1).startOf('day').toDate();
        const endOfMonth = dayjs(startOfMonth).endOf('month').endOf('day').toDate();

        const billExists = await Bill.exists({
          userId: user._id,
          billType,
          billGeneratedDate: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        });

        if (!billExists && user.email) {
          const monthYear = expectedDate.format('MMMM YYYY');

          const mailOptions = {
            from: `"BillStack" <${process.env.NOTIFY_EMAIL}>`,
            to: user.email,
            subject: `Reminder: Please upload your ${billType} bill for ${monthYear}`,
            html: `
              <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 30px;">
                  <h2 style="color: #28a745; font-size: 24px; margin-bottom: 20px;">📥 Bill Upload Reminder</h2>
                  <p style="font-size: 16px;">Hi <strong>${user.name || "there"}</strong>,</p>
                  <p style="font-size: 16px;">We noticed you haven’t uploaded your <strong>${billType}</strong> bill for <strong>${monthYear}</strong>.</p>
                  <p style="font-size: 16px;">To ensure proper tracking and notifications, please upload your bill as soon as possible.</p>
                  <p style="font-size: 16px;">If you've already made the payment, simply upload the bill to keep your records updated.</p>
                  <p style="margin-top: 40px; font-size: 16px;">Thanks for using <strong>BillStack</strong>!</p>
                  <p style="font-size: 16px;">– The BillStack Team</p>
                </div>
              </div>
            `,
          };

          try {
            await transporter.sendMail(mailOptions);
            console.log(`Upload reminder sent to ${user.email} for ${billType}`);
          } catch (err) {
            console.error(`Failed to send upload reminder to ${user.email}:`, err.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in sendBillReminder:', error);
  }
};
