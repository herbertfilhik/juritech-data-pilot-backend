const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes'); // Certifique-se de que o caminho está correto

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com o MongoDB Atlas bem-sucedida'))
  .catch((err) => console.error('Erro ao conectar com o MongoDB Atlas', err));

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.send('Bem-vindo ao servidor do escritório jurídico!');
});

// Usando as rotas de upload definidas em uploadRoutes.js
app.use('/', uploadRoutes);

// Iniciando o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
