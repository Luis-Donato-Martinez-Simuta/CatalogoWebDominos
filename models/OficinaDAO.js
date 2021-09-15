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

function obtenerOficinaPorId(IdOficina , callback) {

    let sql = "call rhchia_db_erp.obtenerOfcinaPorID("+IdOficina+");";

    db.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        if (data.length > 0) {
            return callback(data[0][0]);
        };

        return callback(null);
    });
}

function guardarDatosOficina(IdOficina, nombreOficina, status, callback) {

    let sql = `call oficina_put(`+ IdOficina + `,'`+ nombreOficina+`','`+status+`');`
    console.log(sql);
    
    try {
        db.query(sql, (err, data) => {
            if (err) {
                throw err
            };
            if (data.length > 0) {
                return callback(data[0][0]);
            };
    
            return callback(null);
        });
    } catch (error) {
        return callback(0);
    }


    
}

module.exports = {
    obtenerTodasOficinas,
    obtenerOficinaPorId,
    guardarDatosOficina
}