const {DataTypes} = require('sequelize'); 

const sequelize = require('../config/db'); 

const Ingreso=sequelize.define('ingresos',{
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
    }
    //Revisar la relación de categorias con el ahorrador inteligente y egresos/ingresos
},
{
    tableName:'egresos',
    timestamps:false
}); 

module.exports=Ingreso; 