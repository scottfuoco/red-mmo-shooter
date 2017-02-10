// Send a message to all connected sessions (Client & server)
Streamy.broadcast('hello', { data: 'world!' });

// Attach an handler for a specific message
Streamy.on('hello', function(d) {
  console.log(d.data); // Will print 'world!'

  // On the server side only, the parameter 's' is the socket which sends the message, you can use it to reply to the client, see below
});

// Send a message
// from client to server
Streamy.emit('hello', { data: 'world!' });

// from server to client, you need an instance of the client socket (retrieved inside an 'on' callback or via `Streamy.sockets(sid)`)
Streamy.emit('hello', { data: 'world!' });