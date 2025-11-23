const clients = require("./clients");

function fileBroadcast(event, userID, data) {
    console.log('dataa', data, event)
  const res = clients.get(userID);
  if (res) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

module.exports = { fileBroadcast };
