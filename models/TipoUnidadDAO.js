const db = require('../config/database');

//Con esta funcion logue al usuario
function obtenerTodosTipoUnidad(callback) {

    let sql = "call obtenerTodosTipoUnidad();";

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

function obtenerTipoUnidadPorId(IdTipoUnidad,callback) {
    console.log("id Tipo unidad uno: "+ IdTipoUnidad)

    let sql = "call obtenerTipoUnidadPorId("+IdTipoUnidad+");";

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

function guardarDatosTipoUnidad(
    IdTipoUnidad,
    nombreTipo,
    orden,
    status, callback){
    
    console.log("id tipo dsde metodo: "+IdTipoUnidad)
    let sql = `call tipoUnidad_put(`+ IdTipoUnidad + `,'`+ nombreTipo+ `','`+ orden+`','`+status+`');`
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
    obtenerTodosTipoUnidad,
    obtenerTipoUnidadPorId,
    guardarDatosTipoUnidad
}



