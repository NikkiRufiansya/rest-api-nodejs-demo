const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: 'Email dan password diperlukan'
        });
        return;
    }

    const user = {
        email: 'niki@rml.co.id',
        password: '123456'
    };

    if (email !== user.email || password !== user.password) {
        res.status(401).json({
            message: 'Email atau password tidak sesuai'
        });
        return;
    }

    const expiredTime = Math.floor(Date.now() / 1000) + (15 * 60); // 15 minutes
    const accessToken = jwt.sign({ email: user.email, exp: expiredTime }, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign({ email: user.email, exp: expiredTime }, process.env.REFRESH_TOKEN_SECRET);

    res.json({
        status: 'success',
        access_token: accessToken
    });
});

app.get('/games', (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    
    if (!authorizationHeader) {
        res.status(401).json({
            message: 'Unauthorized'
        });
        return;
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const games = [
            {
                title: 'Dota 2',
                genre: 'Strategy',
                images: 'https://pbs.twimg.com/profile_images/1478893871199186945/1mA6tezL_400x400.jpg',
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
            },
            {
                title: 'Ragnarok',
                genre: 'Role Playing Game',
                images: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png',
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
            }
        ];

        const response = {
            status: 'success',
            data: games
        };

        res.json(response);
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
