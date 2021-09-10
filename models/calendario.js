const db = require('../config/database');

//Con esta funcion obtengo todas las unidades en la base de datos
function obtenerFecha(callback) {
    let sql = "call obtenerFecha()";
    //console.log(sql);
    db.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        if (data.length > 0) {
            console.log('Desde dao: ' + data[0][0].fecha);
            return callback(data[0][0]);
        };

        return callback(null);
    });
}


module.exports = {
    obtenerFecha
}