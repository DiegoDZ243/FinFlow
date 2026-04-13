const {DataTypes} = require('sequelize'); 

const sequelize = require('../config/db'); 

const Egreso = sequelize.define('egresos',{
    clave:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    monto:{
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull:true
    },
    ahorradorId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ahorradoresInteligentes',
            key: 'clave'
        }
    }
},
{
    tableName:'egresos',
    timestamps:false
}); 

module.exports=Egreso; 