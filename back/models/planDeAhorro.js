const {DataTypes} = require('sequelize'); 

const sequelize = require('../config/db'); 

const PlanDeAhorro=sequelize.define("planesDeAhorro",{
    clave:{
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    metaId:{
        type: DataTypes.UUID,
        allowNull: false,
        field: 'meta_id'
    },
    montoMensual:{
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: 1
        }
    },
    mesesEstimados:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    fechaInicio:{
        type: DataTypes.DATE,
        allowNull: false
    },
    estado:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    tableName:'planesDeAhorro',
    timestamps:false
});

module.exports=PlanDeAhorro;