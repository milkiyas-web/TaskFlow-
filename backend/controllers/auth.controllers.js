import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "50m",
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    await User.findByIdAndUpdate(userId, { refreshToken })
}
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
//Admin Signup (initial setup)
export const signup = async (req, res) => {
    const { email, password, confirmPassword, name, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, password: hashedPassword, role: role || "admin" });
        const { accessToken, refreshToken } = generateToken(user._id, user.role);

        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        return res.status(201).json({ message: "Signup successful", user })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
}