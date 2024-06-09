
const {User} = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


dotenv.config();

const secretKey = process.env.JWT_ACCESS_KEY;

const authController = {
    //register
    registerUser: async (req, res, next) => {
        try {
            // const salt = await bcrypt.genSalt(10);
            // const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    loginUser: async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email, password: req.body.password  });
            if (!user) {
                res.status(404).json("Wrong username!");
            }
            // const validPassword = await bcrypt.compare(
            //     req.body.password,
            //     user.password
            // )
            if (!user.password) {
                res.status(404).json("Wrong passord!");
            }
            if (user && user.password) {
                const AccessToken = jwt.sign({
                    id: user.id,
                    // isAdmin: user.isAdmin,
                }, secretKey,
                    { expiresIn: "7d" }
                )
                const body = {
                    status:1,
                    notification:"Đăng nhập thành công!",
                    _id:user._id,
                    name: user.name,
                    email:user.email,
                    about:user.about,
                    type:user.type,
                    token:AccessToken,
                    avatar:user.avatar
                }

                //dont show password
                const { password, ...others } = user._doc;
                res.status(200).json(body);
            };
        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    },
    //LOG OUT
    logOut: async (req, res) => {
        //Clear cookies when user logs out
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out successfully!");
    },
    loginTouch: async (req,res) =>{
        const { email } = req.body;
        try {
            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Assume Touch ID is always valid if it reaches this point
            // Generate a token
            const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    
            res.status(200).json({ token, user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    

}
module.exports = authController;