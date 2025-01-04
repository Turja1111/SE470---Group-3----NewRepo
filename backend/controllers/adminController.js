import User from "../models/userModel.js";


export async function suspend(request, response) {
    try {
        const admin = await User.findById(request.user.id);
        if (!admin) {
            return response.status(401).json({ message: "Admin not found." });
        }
        const { email, reason } = request.body;
        await User.findOneAndUpdate(
            { email },
            { suspended: true },
            { new: true }
        );
        return response.status(200).json({ message:  'suspended successfully.'});
    } catch (error) {
        console.error("Error suspending/unsuspending user:", error);
    }
}
export async function activate(request, response) {
    try {
        const admin = await User.findById(request.user.id);
        if (!admin) {
            return response.status(401).json({ message: "Admin not found." });
        }
        const { email, reason } = request.body;
        await User.findOneAndUpdate(
            { email },
            { suspended: false },
            { new: true }
        );
        return response.status(200).json({ message:  'suspended successfully.'});
    } catch (error) {
        console.error("Error suspending/unsuspending user:", error);
    }
}

export async function isSuspended(request, response) {
    try {
        const user = await User.findOne({ email: request.params.email });
        const admin = await User.findById(request.user.id);
        if (!admin) {
            return response.status(401).json({ message: "Admin not found." });
        }
        if (!user) {
            return response.status(404).json({ message: "User not found." });
        }
        console.log("User email:", user.email);
        return response.status(200).json({ isSuspended: user.suspended});
    }
    catch (error) {
        console.error("Error checking suspension status:", error);
    }
}

