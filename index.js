//index.js back end
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes'); // Certifique-se de que o caminho está correto
const acompanhamentoServicoRoutes = require('./routes/acompanhamentoServicoRoutes'); // Importação da nova rota
const Documento = require('./models/Documento'); // O caminho deve ser ajustado para onde seu modelo Mongoose está localizado

const app = express();
app.use(cors());
app.use(express.json());

// Usando o router com o prefixo /api
app.use('/api', acompanhamentoServicoRoutes);

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('Conexão com o MongoDB Atlas bem-sucedida'))
  .catch((err) => console.error('Erro ao conectar com o MongoDB Atlas', err));

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.send('Bem-vindo ao servidor do escritório jurídico!');
});

// Usando as rotas de upload definidas em uploadRoutes.js
app.use('/', uploadRoutes);
app.use('/', acompanhamentoServicoRoutes);

// Rota para acompanhamento de serviço com filtro
app.get('/acompanhamentoServico', async (req, res) => {
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
app.delete('/api/documentos', async (req, res) => {
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