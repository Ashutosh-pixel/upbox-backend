const express = require('express');
const connectDB = require('./utils/database/dbConnect');
const fileUploadRoute = require('./routes/uploadFileRoute')
const Endpoints = require('./utils/endpoints/endpoint');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
};

app.use(cors(corsOptions));

connectDB()
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log('server started 😊')
    })
    })
    .catch((error) => {
        console.log('Failed to start the server', error);
        process.exit(1)
    })

app.use('/user', fileUploadRoute);