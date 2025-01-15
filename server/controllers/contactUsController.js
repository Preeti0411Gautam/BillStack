import contactUsModel from "../models/contactUsModel.js";

export const createContactUs = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            if (!res.headersSent) {
                return res.status(404).json({
                    success: false,
                    message: "Provide all details"
                });
            }
        }

        const newContactUs = await contactUsModel.create({
            name,
            email,
            message
        });

        if (!res.headersSent) {
            res.status(201).json({
                success: true,
                data: newContactUs,
                message: "Form submitted successfully"
            });
        }
        
        console.log(newContactUs);
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({
                message: "Internal server error",
                err: error.message
            });
        }
    }
};
