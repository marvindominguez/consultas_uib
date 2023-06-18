const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 4000;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Rolex.b1',
  database: 'sys-clinica'
});

app.use(bodyParser.urlencoded({ extended: false }));

// Ruta de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Login For All
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});

//Index Admin
app.get('/index_admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login','admin', 'index_admin.html'));
});

// Index Profesor
app.get('/index_profesor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'profesor','index_profesor.html'));
});

// Index Estudiante
app.get('/index_est', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'estudiante', 'index_est.html'));
});


//Comprobación del login
app.post('/auth', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query('SELECT * FROM usuario WHERE correo = ? AND password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
      res.send('Error al realizar la consulta');
      res.redirect('/')
    } else {
      if (results.length > 0) {
        const user = results[0];
        const tipo = user.tipo;
        if (tipo === 1) {
          res.redirect('/index_admin');
        } else if (tipo === 2) {
          res.redirect('/index_profesor');
        } else if (tipo === 3) {
          res.redirect('/index_est');
        } else {
          res.redirect('/login');
        }
      } else {
        // Si no se encuentra el registro en la base de datos...
        res.redirect('/login');
      }
    }
  });
});

// Obtener datos de usuarios
app.get('/datos', (req, res) => {
  connection.query('SELECT * FROM usuario', (error, results) => {
    if (error) {
      console.log('Error al extraer los datos de MySQL', error);
      res.send('Error al extraer los datos de MySQL');
    } else {
      res.json(results);
      console.log(results)
    }
  });
});

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));


// Manejar eventos de conexión de socket
io.on('connection', (socket) => {
  console.log('Socket conectado:', socket.id);

  // Evento cuando se recibe un mensaje del cliente
  socket.on('message', (data) => {
    const senderId = socket.id;
    const receiverSocket = findReceiverSocket(senderId);

    if (receiverSocket) {
      receiverSocket.emit('chat-message', data);
    }
  });


  // Evento cuando se desconecta el socket
  socket.on('disconnect', () => {
    console.log('Socket desconectado:', socket.id);
  });
});

// Función para encontrar el socket del receptor (el otro cliente)
function findReceiverSocket(senderId) {
  const connectedSockets = io.sockets.connected;

  for (const socketId in connectedSockets) {
    if (socketId !== senderId) {
      return connectedSockets[socketId];
    }
  }

  return null;
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});