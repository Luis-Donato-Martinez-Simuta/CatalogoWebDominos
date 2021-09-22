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


function obtenerPuestoPorId( IdPuesto, callback) {

    let sql = "call obtenerPuestoPorID("+IdPuesto+");";

    try{
        db.query(sql, (err, data) => {
            if (err) {
                throw err
            };
            if (data.length > 0) {
                return callback(data[0][0]);
            };
    
            return callback(null);
        });
    }catch{
        return callback(0);
    }


}

function guardarDatosPuesto( IdPuesto, nombrePusto, status, callback) {

    let sql = "call rhchia_db_erp.puesto_put("+IdPuesto+", '"+nombrePusto+"', "+status+");";

    try{
        db.query(sql, (err, data) => {
            if (err) {
                throw err
            };
            if (data.length > 0) {
                return callback(data[0][0]);
            };
    
            return callback(null);
        });
    }catch{
        return callback(0);
    }


}



module.exports = {
    obtenerTodosPuestos,
    obtenerPuestoPorId,
    guardarDatosPuesto
}