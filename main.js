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
app.get('/', (req, res) => {
  res.status(200).json("Hello User")
})

const clients = new Map();

// SSE endpoint per user
app.get('/event/:userId', (req, res) => {
  const userID = req.params.userId;

  req.socket.setTimeout(0);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Initialize client set for user
  if (!clients.has(userID)) {
    clients.set(userID, new Set());
  }

  const userClients = clients.get(userID);
  userClients.add(res);


  // Clean up when client disconnects
  req.on('close', () => {
    userClients.delete(res);
  });
});

// Lambda notifies this route when a new file is uploaded
app.post('/api/notify', (req, res) => {
  const { userID, storagePath, fileUrl, type, size, filename, uploadTime, updatedAt } = req.body;

  //   const fileUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
  const data = JSON.stringify({ userID, storagePath, fileUrl, type, size, filename, uploadTime, updatedAt });

  if (clients.has(userID)) {
    for (const client of clients.get(userID)) {
      client.write(`data: ${data}\n\n`);
    }
  }

  console.log('DATA', data);


  res.sendStatus(200);
});