import { getUpcomingBills, getMissingBills } from '../services/notificationService.js';

export const getUpcomingBillNotifications = async (req, res) => {
  try {
    const bills = await getUpcomingBills(req.params.userId);
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMissingBillNotifications = async (req, res) => {
  try {
    const bills = await getMissingBills(req.params.userId);
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};