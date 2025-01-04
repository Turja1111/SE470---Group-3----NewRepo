import Report from '../models/Report.js';

export const createReport = async (req, res) => {
    console.log("Received request to create a report");
    try {
        const { userEmail, type, details } = req.body;
        const newReport = new Report({
            userEmail,
            type,
            details
        });
        console.log("New report created:", newReport);
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

