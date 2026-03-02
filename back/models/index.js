const Ahorrador = require('./ahorradorInteligente');
const Ingreso = require('./ingreso'); 
const Egreso = require('./egreso'); 
const Meta = require('./metaFinanciera'); 


Ahorrador.hasMany(Ingreso); 
Ahorrador.hasMany(Egreso); 
Ahorrador.hasMany(Meta);

Ingreso.belongsTo(Ahorrador); 
Egreso.belongsTo(Ahorrador); 
Meta.belongsTo(Ahorrador); 