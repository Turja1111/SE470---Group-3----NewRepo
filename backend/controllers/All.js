import Report from '../models/Report.js';

export const getReports = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.email == "admin@gmail.com") {
            const reports = await Report.find();
            return res.status(200).json(reports);
        }
        const reports = await Report.find({userEmail: user.email});

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};