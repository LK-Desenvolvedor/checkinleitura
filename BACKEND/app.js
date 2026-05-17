const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const projectRoutes = require('./routes/projectRoutes');
const checkInRoutes = require('./routes/checkInRoutes');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const dbURI = process.env.DB_URI;

if (!dbURI) {
  console.error('A variável de ambiente DB_URI não está definida no arquivo .env.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao banco de dados com sucesso!');
  } catch (err) {
    console.error('Conexão com o banco de dados falhou:', err);
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bem-vindo ao Gerenciador de Check-in de Leitura' });
});

app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/projects', projectRoutes);
app.use('/checkins', checkInRoutes);

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor está funcionando na porta ${PORT}`);
});
