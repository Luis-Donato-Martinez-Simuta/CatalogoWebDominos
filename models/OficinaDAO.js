const db = require('../config/database');

//Con esta funcion obtenemos todas las oficinas
function obtenerTodasOficinas(callback) {

    let sql = "call obtenerTodasOficinas();";

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
    obtenerTodasOficinas
}
