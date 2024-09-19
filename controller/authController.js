const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.JWT_ACCESS_KEY;
const avatarUrls = [
    'https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-zalo-50-29-15-13-16.jpg',
    'https://scr.vn/wp-content/uploads/2020/08/Nh%C3%B3c-Maruko-d%E1%BB%85-th%C6%B0%C6%A1ng.jpeg',
    'https://imgt.taimienphi.vn/cf/Images/tt/2021/8/20/top-anh-dai-dien-dep-chat-48.jpg'
];
const authController = {
    // Register a new user
    registerUser: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const randomAvatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                avatar: randomAvatar
            });

            const user = await newUser.save();
            res.status(201).json({ message: 'User registered successfully', status: 1, user });
        } catch (error) {
            res.status(500).json({ message: error.message, status: -1 });
        }
    },

    // Log in a user
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid email or password', status: -1 });
            }

            const accessToken = jwt.sign(
                { id: user._id },
                secretKey,
                { expiresIn: "7d" }
            );

            const { password: userPassword, ...userInfo } = user._doc;

            res.status(200).json({
                message: 'Login successful',
                status: 1,
                body: {
                    ...userInfo,
                    token: accessToken
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message, status: -1 });
        }
    },

    // Log out user
    logOut: async (req, res) => {
        res.clearCookie("refreshToken");
        res.status(200).json({ message: 'Logged out successfully', status: 1 });
    },

    // Log in with biometric data (e.g., email)
    loginBiometric: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found', status: -1 });
            }

            const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '7d' });
            res.status(200).json({ message: 'Biometric login successful', status: 1, token, user });
        } catch (error) {
            res.status(500).json({ message: 'Server error', status: -1 });
        }
    }
};

module.exports = authController;
