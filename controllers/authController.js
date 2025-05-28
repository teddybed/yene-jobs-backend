const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const db = require('../models');
require('dotenv').config();

const User = db.User;
const PendingUser = db.PendingUser;

// Utility to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Register with OTP
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role = 'customer' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });

    const existingPending = await PendingUser.findOne({ where: { email } });
    if (existingPending) return res.status(400).json({ message: 'OTP already sent. Please verify it.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await PendingUser.create({
      name,
      email,
      phoneNumber: phoneNumber || null,
      password: hashedPassword,
      role,
      otp: otp.toString(),
      otpExpiry,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.status(201).json({ message: 'OTP sent to email. Please verify it.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const pendingUser = await PendingUser.findOne({ where: { email } });

    if (!pendingUser) return res.status(404).json({ message: 'No OTP requested for this email.' });
    if (pendingUser.otp !== otp || new Date() > pendingUser.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      phoneNumber: pendingUser.phoneNumber,
      password: pendingUser.password,
      role: pendingUser.role,
    });

    await PendingUser.destroy({ where: { email } });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ id: user.id, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login with email or phone
exports.login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ message: 'Provide email or phone number.' });
    }

    const user = await User.findOne({
      where: email ? { email } : { phoneNumber },
    });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ id: user.id, token, role: user.role, interest: user.interest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Direct Register (without OTP, but with hashed password)
exports.directRegister = async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    if (!email || !name) return res.status(400).json({ message: 'Name and email are required.' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ id: user.id, token, message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Direct Login (no password required)
exports.directLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ id: user.id, token, role: user.role, message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
