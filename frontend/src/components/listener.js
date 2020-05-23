const io = require('socket.io')();
const AmiClient = require('asterisk-ami-client');
const http = require('http');
 
let client = new AmiClient({
    reconnect: true,
    keepAlive: true,
    emitEventsByTypes: true,
    eventFilter: (['ChallengeSent', 'InvalidPassword', 'VarSet', 'BridgeLeave', 'SoftHangupRequest', 'BridgeDestroy', 'RTCPReceived'])
    });

sendBack = event => {
    if (event.ChannelState == "0") {
      io.sockets.emit('eventClient', event);
      return event;
      } 
    }

client.connect(username, password, {host: 'localhost', port: 5038})
 .then(amiConnection => {

     client
         .on('connect', () => console.log('connect'))
         .on('event', event => {console.log(event);sendBack(event);})
         .on('response', response => console.log(response))
         .on('disconnect', () => console.log('disconnect'))
         .on('reconnection', () => console.log('reconnection'))
         .on('internalError', error => console.log(error))
         .action({
             Action: 'Ping'
         });

 })
 .catch(error => console.log(error));
const server = http.createServer();

const port = 8000;
const hostname = '0.0.0.0';
server.listen(port, hostname);
io.listen(server);
console.log('listening on port ', port);
