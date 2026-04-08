require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Código base del backend de FinFlow!');
});

const {registrarAhorrador} = require('./routes/AhorradoresInteligentes/registrar');
const {loginAhorrador} = require('./routes/AhorradoresInteligentes/login');

app.use('/api/ahorradores', registrarAhorrador);
app.use('/api/ahorradores', loginAhorrador);

sequelize.sync()
    .then(() => console.log('Tablas sincronizadas correctamente'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});