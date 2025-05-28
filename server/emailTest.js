import transporter from "../services/mailer.js";

export const sendBillReminder = async ({ userEmail, billName, dueDate }) => {
  const formattedDate = new Date(dueDate).toLocaleDateString("en-IN");

  const mailOptions = {
    from: `"BillStack" <${process.env.NOTIFY_EMAIL}>`,
    to: userEmail,
    subject: `🔔 Reminder: Your "${billName}" bill is due on ${formattedDate}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>⏰ Bill Reminder</h2>
        <p>Hey there!</p>
        <p>This is a gentle reminder that your <strong>${billName}</strong> bill is due on <strong>${formattedDate}</strong>.</p>
        <p>Don't forget to pay it on time to avoid penalties!</p>
        <br />
        <p>Thanks,<br/>Team BillStack</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder sent to ${userEmail}:`, info.messageId);
  } catch (err) {
    console.error(`❌ Failed to send reminder to ${userEmail}:`, err.message);
  }
};
