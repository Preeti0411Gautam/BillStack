import Feedback from "../models/feedbackModel.js";
export const uploadFeedback = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { feedback, rating, name } = req.body;
  
        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User ID not provided",
            });
        }
  
        if (!feedback || !rating || !name) {
            return res.status(400).json({
                success: false,
                message: "Incomplete feedback data provided",
            });
        }
  
        // Assuming you have a Feedback model to save the feedback data
        const newFeedback = await Feedback.create({
            userId,
            feedback,
            rating,
            name,
            date: new Date(),
        });
        res.status(201).json({
            success: true,
            data: newFeedback,
            message: "Feedback submitted successfully",
        });

     console.log(data)

    } catch (err) {
        next(err);
    }
  };
  



export const getAllFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 }); // Sort by date, newest first
        res.status(200).json({
            success: true,
             feedbacks
        });
        console.log(feedbacks)
    } catch (err) {
        next(err);
    }
};

