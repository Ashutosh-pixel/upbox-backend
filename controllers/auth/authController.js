const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../../utils/token");
const RefreshToken = require("../../models/RefreshToken");
const redisClient = require("../../utils/redis/redis");

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
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }).json({ accessToken, name: user.name, email: user.email, totalStorage: user.totalStorage, usedStorage: user.usedStorage });


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
            return res.status(400).json({ message: "User already exists", errorCode: "DUPLICATE_EMAIL" });
        }

        // hash passwrd
        const hashedPassword = await bcrypt.hash(password, 10);

        // store temp details in redis
        const detailKey = `user:${email}`
        await redisClient.hSet(
            detailKey,
            {
                name: name.trim(),
                email: email.trim(),
                password: hashedPassword
            }
        )

        await redisClient.expire(detailKey, 600);

        return res.status(200).json({ message: "All checks passed", successCode: "CHECK_PASSED" })

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Signup failed", errorCode: "CHECK_FAILED" });
    }
}

const logout = async (req, res) => {
    const token = req.cookies.RefreshToken;

    await RefreshToken.deleteOne({ token });

    res.clearCookie("refreshToken");
    res.sendStatus(204);
}

const newAccount = async (req, res) => {
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
            return res.status(400).json({ message: "User already exists", errorCode: "DUPLICATE_EMAIL" });
        }


        const key = `user:${email}`;

        let cachedUser = await redisClient.hGetAll(key);

        let user;

        if (cachedUser && Object.keys(cachedUser).length > 0) {
            // create user
            user = await User.create({
                name: cachedUser.name,
                email: cachedUser.email,
                password: cachedUser.password,
            });

            await redisClient.del(key);
        }
        else {
            // hash passwrd
            const hashedPassword = await bcrypt.hash(password, 10);

            // create user
            user = await User.create({
                name,
                email,
                password: hashedPassword,
            });
        }

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
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(201)
            .json({
                accessToken,
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    totalStorage: user.totalStorage,
                    usedStorage: user.usedStorage
                },
            });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Signup failed", errorCode: "CHECK_FAILED" });
    }
}

module.exports = { login, signup, logout, newAccount };