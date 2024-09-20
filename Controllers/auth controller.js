const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        console.log("Signup request received:", { name, email, password });
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) {
                    console.error('JWT Signing Error:', err.message);
                    return res.status(500).json({ msg: 'Server error' });
                }
                res.json({ msg: 'User registered successfully', token });
            }
        );
    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const uploadCV = (req, res) => {
    console.log('File received:', req.file); 

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
};


module.exports = {
    signup,
    login,
    uploadCV
};
