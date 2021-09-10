const db = require('../config/database');

//Con esta funcion recupera todos los puestos cargados en el sistema 
function obtenerTodosPuestos(callback) {

    let sql = "call obtenerTodosPuestos();";

    db.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        if (data.length > 0) {
            return callback(data[0]);
        };

        return callback(null);
    });
}


module.exports = {
    obtenerTodosPuestos
}