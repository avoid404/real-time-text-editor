const webSocketPort = 8080;

const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketPort);

const ws = new webSocketServer({
    httpServer: server,
});


const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

function sendMessage(msg, blackListClient = null) {
  Object.values(clients).forEach(client => {
    if(client !== blackListClient) {
      client.send(msg);
    }
  })
}

ws.on('request', (req) => {
    var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + req.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = req.accept(null, req.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message', (msg) => {
    const reqBody = JSON.parse(msg.utf8Data);
    sendMessage(msg.utf8Data, connection);
  })

  connection.on('close', function(connection) {
    console.log((new Date()) + " Peer " + userID + " disconnected.");
    const json = { type: "USER_EVENT" };
    // userActivity.push(`${users[userID].username} left the document`);
    // json.data = { users, userActivity };
    delete clients[userID];
    sendMessage(JSON.stringify(json));
  });
})
