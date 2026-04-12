require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Código base del backend de FinFlow!');
});

const authRouter = require('./routes/AhorradoresInteligentes');
const metasRouter = require('./routes/MetasFinancieras');

app.use('/api/ahorradores', authRouter);
app.use('/api/metas', metasRouter);

sequelize.sync()
    .then(() => console.log('Tablas sincronizadas correctamente'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});