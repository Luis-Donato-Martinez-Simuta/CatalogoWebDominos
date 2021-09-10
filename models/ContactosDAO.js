const db = require('../config/database');

//Con esta funcion mandamos a llamar a todos los contactos en la base de datos con un SP
function obtenerTodosContactos(callback) {
    let sql = "call obtenerTodosContactos()";
    //console.log(sql);
    db.query(sql, (err, data) => {
        if (err) {
            throw err
        };
        if (data.length > 0) {
            //console.log('Desde logueo: ' + data[0][0]);
            return callback(data[0]);
        };

        return callback(null);
    });
}

function obtenerContactoPorId(IdContacto, callback) {


    let sql = "call obtenerContactoPorID(" + IdContacto + ");";

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

function guardarContacto(
    IdContacto,
    IdOficina,
    IdPuesto,
    nombreContacto,
    telefonoOficina,
    extTelefono,
    celular,
    mail,
    cumpleanos,
    esVisible,
    /* callback */
    callback) {

    /*console.log("Datos del contacto:",
        IdContacto,
        IdOficina,
        IdPuesto,
        nombreContacto,
        telefonoOficina,
        extTelefono,
        celular,
        mail,
        cumspleanos,
        esVisible);
    */

    let sql = "call contacto_put(" +
        IdContacto + "," +
        IdOficina + "," +
        IdPuesto + ",'" +
        nombreContacto + "','" +
        telefonoOficina + "','" +
        extTelefono + "','" +
        celular + "','" +
        mail + "','" +
        cumpleanos + "'," +
        esVisible + ");"
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
    guardarContacto,
    obtenerTodosContactos,
    obtenerContactoPorId
}