const db = require('../config/database');

//Con esta funcion logue al usuario
function obtenerTodasFranquicias(callback) {

    let sql = "call obtenerTodasFranquicias();";

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

function obtenerFranquiciaPorId(IdFranquicia,callback) {
    console.log("id franquicia uno: "+ IdFranquicia)

    let sql = "call obtenerFranquiciaPorId("+IdFranquicia+");";

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

function guardarDatosFranquicia(
    IdFranquicia,
    nombreFranquicia,
    status, callback){
    
    let sql = `call franquicias_put(`+ IdFranquicia + `,'`+ nombreFranquicia+`','`+status+`');`
    console.log(sql);
    

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

module.exports = {
    obtenerTodasFranquicias,
    obtenerFranquiciaPorId,
    guardarDatosFranquicia

}
