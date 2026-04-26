const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../../utils/token");
const RefreshToken = require("../../models/RefreshToken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email missing" })
        }

        if (!password) {
            return res.status(400).json({ message: "Password missing" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password is too short" })
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const vaild = await bcrypt.compare(password, user.password);
        if (!vaild) return res.status(400).json({ message: "Invalid password" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await RefreshToken.create({
            userId: user._id,
            token: refreshToken
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        }).json({ accessToken });


    } catch (error) {
        res.status(500).json({ message: "Login failed" })
    }
}

const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {

        if (!email) {
            return res.status(400).json({ message: "Email is missing" })
        }

        if (!password) {
            return res.status(400).json({ message: "Password is missing" })
        }


        if (!name) {
            return res.status(400).json({ message: "Name is missing" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password is too short" })
        }


        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash passwrd
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await RefreshToken.create({
            userId: user._id,
            token: refreshToken
        })

        // send response
        res
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            })
            .status(201)
            .json({
                accessToken,
                user: {
                    _id: user._id,
                    email: user.email,
                },
            });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Signup failed" });
    }
}

module.exports = { login, signup };