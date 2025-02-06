const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

const router = express.Router();
/*
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Muitas tentativas de login. tente novamente mais tarde.',
});
*/
const generateToken = (user) => {
    return jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '7d'});
};

router.post('/cadastro', async (req, res) => {
    let {name, email, password, phone, cpf, birthDate, gender} = req.body;

    email = email.trim().toLowerCase();
    cpf = cpf.trim();

    try {
        const existingUser = await User.findOne({$or: [{ email}, {phone: phone.trim()}, {cpf}]});
        if (existingUser) {
            return res.status(400).json({message: 'Usuário já cadastrado com este email, CPF ou telefone.'});
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({name, email, password: hashedPassword, phone, cpf, birthDate, gender});
        await newUser.save();

        res.status(201).json({message: 'Usuário registrado com sucesso'});
    } catch (error) {
        res.status(500).json({message: 'Erro no servidor'});
    }
});

// Login tradicional (E-mail ou CPF)
router.post('/login', async (req, res) => {
    const {emailCpf, password} = req.body;

    try {
        let user = await User.findOne(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCpf) ? { email: emailCpf.trim().toLowerCase() } : { cpf: emailCpf.trim() })

        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({message: 'E-mail, CPF ou senha incorretos.'});
        }

        const token = generateToken(user);
        console.log(token)
        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000,
        });

        res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    try {
        const token = generateToken(req.user);

        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000, 
        });

        res.redirect(process.env.FRONTEND_URL); 
    } catch (error) {
        res.status(500).json({ message: 'Erro ao autenticar com Google' });
    }
    }
);

// Logout
router.get('/logout', (req, res, next)=> {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(process.env.FRONTEND_URL);
    });
})

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        };
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
})

module.exports = router;