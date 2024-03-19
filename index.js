//index.js back end
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes'); // Certifique-se de que o caminho está correto
const acompanhamentoServicoRoutes = require('./routes/acompanhamentoServicoRoutes'); // Importação da nova rota
const incluireExcluirOperacao = require('./routes/incluireExcluirOperacao'); // Importação da nova rota
const Documento = require('./models/Documento'); // O caminho deve ser ajustado para onde seu modelo Mongoose está localizado
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Usando o router com o prefixo /api
app.use('/api', acompanhamentoServicoRoutes);
app.use('/api', incluireExcluirOperacao);

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('Conexão com o MongoDB Atlas bem-sucedida'))
  .catch((err) => console.error('Erro ao conectar com o MongoDB Atlas', err));

const verifyToken = (req, res, next) => {
  // Extrai o token do cabeçalho Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Divide a string pelo espaço e pega o segundo elemento (o token)

  if (!token) {
    return res.status(403).send("Um token é necessário para a autenticação");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Verifica se o erro é especificamente devido a um token expirado
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token expirado");
    }
    return res.status(401).send("Token inválido");
  }

  return next();
};

module.exports = verifyToken;

const USERS = {
  admin: { password: 'senha123' }, // Em um cenário real, use hash de senha
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (USERS[username] && USERS[username].password === password) {
    // Se bem-sucedido, cria o token
    //const token = jwt.sign({ userId: USERS[username].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const token = jwt.sign({ userId: USERS[username].id }, process.env.JWT_SECRET, { expiresIn: '1m' });
    // Envia tanto a mensagem quanto o token na mesma resposta
    res.json({ message: 'Login bem-sucedido!', token });
  } else {
    res.status(401).json({ message: 'Usuário ou senha inválidos!' });
  }
});

// Rota de boas-vindas
app.get('/', verifyToken, (req, res) => {
  res.send('Bem-vindo ao servidor do escritório jurídico!');
});

// Usando as rotas de upload definidas em uploadRoutes.js
app.use('/', uploadRoutes);
app.use('/', acompanhamentoServicoRoutes);

// Rota para acompanhamento de serviço com filtro
app.get('/acompanhamentoServico', verifyToken, async (req, res) => {
  const { filtro } = req.query;
  try {
    // Substitua 'YourModel' pelo modelo Mongoose que você está usando para consultar os dados
    const query = filtro ? { 'ControleTarget': new RegExp(filtro, 'i') } : {};
    const resultados = await YourModel.find(query);
    res.status(200).json(resultados);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar a consulta no banco de dados', error });
  }
});

// Rota para acompanhamento de serviço com filtro
app.get('/incluireExcluirOperacao', verifyToken, async (req, res) => {
  const { filtro } = req.query;
  try {
    // Substitua 'YourModel' pelo modelo Mongoose que você está usando para consultar os dados
    const query = filtro ? { 'ControleTarget': new RegExp(filtro, 'i') } : {};
    const resultados = await YourModel.find(query);
    res.status(200).json(resultados);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar a consulta no banco de dados', error });
  }
});

// Iniciando o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Rota para excluir todos os documentos
app.delete('/api/documentos', verifyToken, async (req, res) => {
  try {
    const resultado = await Documento.deleteMany({});
    if (resultado.deletedCount === 0) {
      return res.status(404).send("Não havia documentos para excluir.");
    } else {
      return res.status(200).send("Documentos excluídos com sucesso.");
    }
  } catch (error) {
    console.error("Erro ao excluir documentos:", error);
    return res.status(500).send("Erro ao excluir documentos.");
  }
});