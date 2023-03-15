const xmpp = require("node-xmpp-client");
const xml = require("@xmpp/xml");

const client = new xmpp.Client({
  jid: "username1@localhost",
  password: "123",
  host: "localhost",
  port: 5222,
  reconnect: true,
});

client.on("online", () => {
  console.log("Connected to Ejabberd server");

  const stanza = xml(
    "message",
    { to: "admin@localhost", type: "chat" },
    xml("body", null, "Hello world!")
  );

  console.log(stanza.toString());

  client.send(stanza);
});

client.on("error", (err) => {
  console.error(err);
});

client.on("stanza", (stanza) => {
  console.log("Received stanza: ", stanza.toString());
});
