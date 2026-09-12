import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Player from '../models/Player.js';

const JWT_SECRET = process.env.JWT_SECRET || 'footfriend_secret_key_2026';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role, position, jerseyNumber, bio, profileImage } = req.body;

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'PLAYER'
    });

    // Auto-create associated Player Profile
    const player = await Player.create({
      userId: user._id,
      name: user.name,
      position: position || 'Forward',
      jerseyNumber: Number(jerseyNumber) || 10,
      bio: bio || '',
      profileImage: profileImage || ''
    });

    user.playerId = player._id;
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      playerId: player,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() }).populate('playerId');
    if (user && (await bcrypt.compare(password, user.password))) {

      // Auto-heal missing player profile for older accounts
      if (!user.playerId) {
        const player = await Player.create({
          userId: user._id,
          name: user.name,
          position: 'Forward',
          jerseyNumber: 10
        });
        user.playerId = player;
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        playerId: user.playerId,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('playerId').select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
