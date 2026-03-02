const {DataTypes} = require('sequelize'); 

const sequelize = require('../config/db'); 

const ahorradorInteligente=sequelize.define('ahorradoresInteligentes',{
    clave:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    email:{
        type: DataTypes.STRING,
        validate:{
            isEmail:{
                msg: "Ingrese un correo válido"
            },
            len:[3,60]
        },
        allowNull:false
    },
    fechaRegistro:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
{
    tableName:'ahorradoresInteligentes',
    timestamps:false
}
); 

module.exports=ahorradorInteligente; 