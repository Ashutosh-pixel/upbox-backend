const express = require('express');
const connectDB = require('./utils/database/dbConnect');
const fileRoute = require('./routes/FileRoute')
const cors = require('cors');
const folderRoute = require("./routes/FolderRoute");
const { fileBroadcast } = require("./utils/sse/sseManager");
const clients = require("./utils/sse/clients");
const globalSearch = require('./controllers/search/globalSearch');

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

app.use('/user', fileRoute);
app.use('/folder', folderRoute);
app.get('/', (req, res) => {
  res.status(200).json("Hello User")
})
app.get("/search", globalSearch);

app.get('/connection/:userID', async (req, res) => {
  res.setHeader('Content-Type', "text/event-stream");
  res.setHeader('Cache-Control', "no-cache");
  res.setHeader('Connection', "keep-alive");
  res.flushHeaders();

  const userID = req.params.userID;

  if (!clients.has(userID)) {
    // store the SSE response object so we can write to it later
    clients.set(userID, res);
  }
  console.log("connected client", userID);

  req.on("close", () => {
    // client disconnected; remove stored response object
    console.log("disconnected client", userID);
    clients.delete(userID);
  });
});

app.post("/lambda/notify", async (req, res) => {
  // console.log("lambda/notify", req.body);

  fileBroadcast("fileUploaded", req.body.userID, [req.body]);

  res.sendStatus(200);
});
