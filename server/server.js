require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./middleware/passport');
const cookieParser = require('cookie-parser')
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Cross-Origin-Opener-Policy", "unsafe-none");

    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        console.log('Conectado ao MongoDB')
    } catch(err) {
        console.log('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
})();

/** Rotas **/
app.use('/api', require('./routes'));

app.get('/', (req, res) => res.send('Backend funcionando!'));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));