const sequelize = require('../config/db');
const Ahorrador = require('./ahorradorInteligente');
const Ingreso = require('./ingreso'); 
const Egreso = require('./egreso'); 
const Meta = require('./metaFinanciera');
const PlanDeAhorro = require('./planDeAhorro');
const AporteMeta = require('./aporteMeta');

Ahorrador.hasMany(Ingreso); 
Ahorrador.hasMany(Egreso); 
Ahorrador.hasMany(Meta);
Ahorrador.hasMany(PlanDeAhorro);

Ingreso.belongsTo(Ahorrador); 
Egreso.belongsTo(Ahorrador); 
Meta.belongsTo(Ahorrador);
PlanDeAhorro.belongsTo(Ahorrador);
PlanDeAhorro.belongsTo(Meta, { foreignKey: 'metaId', as: 'meta' });

Meta.hasMany(AporteMeta, { foreignKey: 'metaClave', as: 'aportes' });
AporteMeta.belongsTo(Meta, { foreignKey: 'metaClave', as: 'meta' });

module.exports = { sequelize, models: { Ahorrador, Ingreso, Egreso, Meta, PlanDeAhorro, AporteMeta } }; 
