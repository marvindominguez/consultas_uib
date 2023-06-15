const express = require('express')
// const mysql = require('mysql')
// const express = require('express-session')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))


// const connection = mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: '',
//       database:'consultas_iub '
// });

// app.get('/auth', function(request, response){
//   let username = request.body.username;
//   let password = request.body.password;
//   if (username && password) {
//     connection.query('SELECT * FROM consultas_iub WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
// 			// If there is an issue with the query, output the error
// 			if (error) throw error;
// 			// If the account exists
// 			if (results.length > 0) {
// 				// Authenticate the user
// 				request.session.loggedin = true;
// 				request.session.username = username;
// 				// Redirect to home page
// 				response.redirect('/home');
// 			} else {
// 				response.send('Usuario y/o Contraseña Incorrecta');
// 			}			
// 			response.end();
// 		});
// 	} else {
// 		response.send('Por favor ingresa Usuario y Contraseña!');
// 		response.end();
// 	}


// });



const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConected = new Set()

io.on('connection', onConnected)

function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })

  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })
}
