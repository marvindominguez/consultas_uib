const express = require('express')
const mysql = require('mysql')
// const express = require('express-session')
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log(`💬 server on port ${PORT}`))


const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Rolex.b1',
  database: 'sys-clinica'
});


app.use(bodyParser.urlencoded({ extended: false }));


// Index 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login_est', 'login.html'));
});

// Index_Est
app.get('/index_est', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login_est', 'index_est.html'));
});



// Login_Est
app.post('/auth', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query('SELECT * FROM usuario WHERE correo = ? AND password = ?', [username, password], (error, results) => {
    // If there is an issue with the query, output the error
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.send('Error al realizar la consulta');
    } else {
      if (results.length > 0) {
        res.redirect('/index_est')
      } else {
        res.redirect('/login');
      }
    }
  });
});



// const io = require('socket.io')(server)

// app.use(express.static(path.join(__dirname, 'public')))

// let socketsConected = new Set()

// io.on('connection', onConnected)

// function onConnected(socket) {
//   console.log('Socket connected', socket.id)
//   socketsConected.add(socket.id)
//   io.emit('clients-total', socketsConected.size)

//   socket.on('disconnect', () => {
//     console.log('Socket disconnected', socket.id)
//     socketsConected.delete(socket.id)
//     io.emit('clients-total', socketsConected.size)
//   })

//   socket.on('message', (data) => {
//     // console.log(data)
//     socket.broadcast.emit('chat-message', data)
//   })

//   socket.on('feedback', (data) => {
//     socket.broadcast.emit('feedback', data)
//   })
// }
