const {Sequelize} = require('sequelize'); 

const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

async function testConnection(){
    try{
        await sequelize.authenticate(); 
        console.log("Conexion exitosa :)"); 
    }catch(error){
        console.error("Ocurrio un error :(",error); 
    }
}

testConnection(); 

module.exports=sequelize; 