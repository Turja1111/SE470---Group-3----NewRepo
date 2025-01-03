import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

export async function verifyEmail(req, res) {
    try {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const url = `http://localhost:5000/confirm-email?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });
        const user = await User.findById(req.user.id);
        console.log("About to transport")
        await transporter.sendMail({
            to: user.email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
        });
        res.status(200).json({ message: 'Verification email sent.' });
    } catch (error) {
        console.error(error);
    }

};


export async function confirmEmail(req, res) {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await User.findByIdAndUpdate(decoded.id, { verified: true });
        res.redirect('http://localhost:5173/profile');
    } catch (error) {
        res.redirect('http://localhost:5173/login?error=invalid-token');
    }
};

export async function sendPasswordResetEmail(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist" });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: 'Reset Your SoulSpeak Password',
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>SoulSpeak Team</p>
            `,
        });

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Password reset email error:', error);
        res.status(500).json({ message: 'Error sending password reset email' });
    }
}
export async function resetPassword(req, res) {
    try {
        const { token } = req.body;
        const { password } = req.body;
        console.log(    token, password)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
}

export async function signup(request, response) {
    try {
        const body = await request.body;
        const {
            referral,
            mentalCondition,
            name,
            username,
            email,
            password,
            ageGroup,
            gender,
            country,
            goals,
            preferences
        } = body;
        const requiredFields = {
            referral,
            mentalCondition,
            name,
            username,
            email,
            password,
            ageGroup,
            gender,
            country,
            goals,
            preferences
        };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return response.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.email === email) {
                return response.status(400).json({
                    message: "Email already in use."
                });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            referral,
            mentalCondition,
            name,
            username,
            email,
            password: hashedPassword,
            ageGroup,
            gender,
            country,
            goals,
            preferences
        });
        await newUser.save();

        return response.status(201).json({
            message: "User registered successfully.",
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Error during signup:", error);
        return response.status(500).json({
            message: "Internal server error."
        });
    }
}

export async function login(request, response) {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(401).json({ message: "Invalid email or password." });
        }
        if (user.suspended) {
            return response.status(403).json({ message: "Your account has been suspended." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid email or password." });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "48h" }
        );

        return response.status(200).json({
            message: "Login successful.",
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        return response.status(500).json({ message: "Internal server error." });
    }
}
