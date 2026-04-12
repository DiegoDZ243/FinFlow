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

const {registrarAhorrador} = require('./routes/AhorradoresInteligentes/registrar');
const {loginAhorrador} = require('./routes/AhorradoresInteligentes/login');
const crearMetaRouter = require('./routes/MetasFinancieras/create');
const obtenerTodasMetasRouter = require('./routes/MetasFinancieras/getAll');
const obtenerMetaPorIdRouter = require('./routes/MetasFinancieras/getById');
const actualizarMetaRouter = require('./routes/MetasFinancieras/update');
const eliminarMetaRouter = require('./routes/MetasFinancieras/delete');
const progresoRouter = require('./routes/MetasFinancieras/progreso');
const aportarRouter = require('./routes/MetasFinancieras/aportar');

app.use('/api/ahorradores', registrarAhorrador);
app.use('/api/ahorradores', loginAhorrador);
app.use('/api/metas', crearMetaRouter);
app.use('/api/metas', obtenerTodasMetasRouter);
app.use('/api/metas', obtenerMetaPorIdRouter);
app.use('/api/metas', actualizarMetaRouter);
app.use('/api/metas', eliminarMetaRouter);
app.use('/api/metas', progresoRouter);
app.use('/api/metas', aportarRouter);

sequelize.sync()
    .then(() => console.log('Tablas sincronizadas correctamente'))
    .catch(err => console.error('Error al sincronizar:', err));

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});