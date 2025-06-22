import Bill from '../models/billModel.js';
import dayjs from 'dayjs';

export const getUpcomingBills = async (userId) => {
  const today = dayjs().startOf('day');
  const fiveDaysLater = dayjs().add(5, 'day').endOf('day');

  console.log("🔍 Getting upcoming bills for user:", userId);
  console.log("📅 Date range:", {
    from: today.format('YYYY-MM-DD HH:mm:ss'),
    to: fiveDaysLater.format('YYYY-MM-DD HH:mm:ss')
  });

  try {
    const bills = await Bill.find({
      userId,
      dueDate: { $gte: today.toDate(), $lte: fiveDaysLater.toDate() },
      paymentStatus: false
    }).sort({ dueDate: 1 });

    console.log(`✅ Found ${bills.length} upcoming bill(s)`);
    return bills;
  } catch (error) {
    console.error("❌ Error fetching upcoming bills:", error);
    throw error;
  }
};


export const getMissingBills = async (userId) => {
  const today = dayjs();
  const currentMonth = today.month();
  const currentYear = today.year();
  const expectedBillTypes = ['Electricity', 'Water', 'Gas', 'Internet', 'Rent', 'Other'];
  
  const missingBills = [];

  for (const billType of expectedBillTypes) {
    const billExists = await Bill.exists({
      userId,
      billType,
      billGeneratedDate: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });

    if (!billExists) {
      missingBills.push({
        billType,
        expectedDate: new Date(currentYear, currentMonth, 10)
      });
    }
  }

  return missingBills;
};