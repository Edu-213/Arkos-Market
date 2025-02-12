const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
/*
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Muitas tentativas de login. tente novamente mais tarde.',
});
*/

router.get('/me', verifyToken, AuthController.getUserProfile);

router.get('/logout', (req, res, next)=> {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(process.env.FRONTEND_URL);
    });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.post('/cadastro', [body('name').notEmpty(), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 8 }), body('phone').isMobilePhone(), body('cpf').isLength({ min: 11, max: 11 }), body('birthDate').notEmpty(), body('gender').notEmpty()], validateRequest, AuthController.registerUser);

// Login tradicional (E-mail ou CPF)
router.post('/login', [body('emailCpf').notEmpty(), body('password').notEmpty().isLength({ min: 6 })], validateRequest, AuthController.loginUser);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), AuthController.googleCallback);

module.exports = router;