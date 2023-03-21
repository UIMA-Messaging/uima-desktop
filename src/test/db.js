const xmpp = require('node-xmpp-client')

// Connect to the XMPP server
const client = new xmpp.Client({
  jid: 'username1@localhost',
  password: '123',
  host: 'localhost',
  port: 5222,
})

// Wait for the client to connect
client.on('online', () => {
  console.log('Connected as', client.jid.toString())

  // Send a MAM query to the server for unread messages
  // client.send(
  //   new xmpp.Stanza('iq', { type: 'get', id: '123456' })
  //     .c('query', { xmlns: 'urn:xmpp:mam:1' })
  //     .c('x', { xmlns: 'jabber:x:data', type: 'submit' })
  //     .c('field', { var: 'FORM_TYPE', type: 'hidden' })
  //     .c('value').t('urn:xmpp:mam:1').up()
  //     .c('field', { var: 'end' })
  //     .c('value').t(new Date().toISOString()).up()
  //     .c('field', { var: 'with' })
  //     .c('value').t('admin@localhost/174024716262933073314098')
  // );
  client.send(`<iq type='set' id='10bca'>
    <inbox xmlns='erlang-solutions.com:xmpp:inbox:0' queryid='b6'/>
  </iq>`)
})

// Handle MAM results
client.on('stanza', (stanza) => {
  console.log(JSON.stringify(stanza, null, 2))
  if (stanza.is('iq') && stanza.getChild('query', 'urn:xmpp:mam:1')) {
    const results = stanza.getChild('query', 'urn:xmpp:mam:1').getChildren('result')
    console.log('Unread messages:', results.length)
    results.forEach((result) => {
      console.log(result.getChildText('body'))
    })
  }
})
