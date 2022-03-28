const osc = require("osc");
const { disconnect } = require("process");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const wsConnections = [];

const broadcast = (message) => {
  console.log(message);
  wsConnections.forEach((connection) => {
    connection.send(message);
  });
};
const getIPAddresses = function () {
  var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
};

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 12000,
});

udpPort.on("ready", function () {
  var ipAddresses = getIPAddresses();

  console.log("Listening for OSC over UDP.");
  ipAddresses.forEach(function (address) {
    console.log(" Host:", address + ", Port:", udpPort.options.localPort);
  });
});

udpPort.on("message", function (oscMessage) {
  switch (oscMessage.address) {
    case "/test": {
      const action = {
        type: "TEST",
        payload: {
          todo: "args here",
        },
      };
      broadcast(JSON.stringify(action));
      break;
    }
    case "/wek/outputs": {
      // TODO: send only on change
      const action = {
        type: "WEKINATOR",
        payload: {
          address: oscMessage.address,
          args: oscMessage.args,
        },
      };
      broadcast(JSON.stringify(action));
      break;
    }
    default: {
      console.log("unhandled osc message", oscMessage.address);
      break;
    }
  }
});

udpPort.on("error", function (err) {
  console.log(err);
});

udpPort.open();

wss.on("connection", function connection(ws) {
  wsConnections.push(ws);
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  //   TODO: handle disconnect, remove connection from array/map
});
