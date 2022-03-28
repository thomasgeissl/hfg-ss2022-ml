const Bundle = require("node-osc").Bundle;
const Message = require("node-osc").Message;
const Client = require("node-osc").Client;
class Argument {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const optionDefinitions = [
  { name: "verbose", alias: "v", type: Boolean },
  { name: "host", alias: "h", type: String, defaultOption: "localhost" },
  { name: "port", alias: "p", type: Number, defaultOption: 8000 },
  { name: "message", alias: "m", type: String, multiple: false },
];

const commandLineArgs = require("command-line-args");
const options = commandLineArgs(optionDefinitions);

console.log(options);
const { host, port, message } = options;
const parts = message.split(" ");

const address = parts[0] ? parts[0] : "/test";
const msg = new Message();
msg.address = address;
msg.args = [];
parts.forEach((arg, index) => {
  if (index > 0) {
    let argOut;
    if (!isNaN(arg)) {
      if (isNumeric(arg)) {
        argOut = new Argument("float", parseFloat(arg));
      } else {
        argOut = new Argument("integer", parseInt(arg));
      }
    } else if (arg === "true" || arg === "T") {
      argOut = new Argument("boolean", true);
    } else if (arg === "false" || arg === "F") {
      argOut = new Argument("boolean", false);
    } else {
      argOut = new Argument("string", arg);
    }
    if (argOut) msg.args.push(argOut);
  }
});

const client = new Client(host, port);
client.send(msg, (error) => {
  if (error) console.error(error);
  client.close();
});
