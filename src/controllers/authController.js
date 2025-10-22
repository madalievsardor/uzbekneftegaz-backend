const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = "7d"
exports.register = async (req, res) => {
    try {
        const { username, password, phone } = req.body;

        if (!username || !password || !phone) {
            return res.status(400).json({ message: "All field required" })
        }

        const existisingUser = await userModel.findOne({ phone });
        if (existisingUser) {
            return res.status(400).json({ message: "This number already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userModel({
            username,
            password: hashedPassword,
            phone,
            
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, phone: newUser.phone }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                phone: newUser.phone,
            },
            token,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { phone, password, role } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: "All field required" })
        }

        const user = await userModel.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: "User not found " })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" })
        }

        const token = jwt.sign(
            { id: user._id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                phone: user.phone,
                role: role
            },
            token,
        });
    } catch (e) {
        console.log("Server error")
        res.status(500).json({ message: "Server error", error: e.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find();
        res.status(200).json({message: "All users", users})
    } catch(e) {
         res.status(500).json({message: "Server error"})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

