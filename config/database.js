const mysql = require('mysql');

const config ={
    host    : '200.52.83.41',
    user    : 'rhchia_admin',
    password: 'Admin@2021',
    database: 'rhchia_db_erp'
};
const connection = mysql.createConnection(config);
connection.connect(function(err) {
    if (err){
        console.log('Error en la conexion a la base de datos:');
        throw err;
    } 
    console.log('Conexion exitosa con la Base de Datos!');
});

module.exports = connection;