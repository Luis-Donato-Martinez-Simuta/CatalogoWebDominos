const db = require('../config/database');

//Con esta funcion logue al usuario
function obtenerTodosContactos(callback) {

    let sql = "call obtenerTodosContactos();";

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

function obtenerContactoPorId(IdContacto,callback) {
    console.log("id contacto uno: "+ IdContacto)

    let sql = "call obtenerContactoPorID("+IdContacto+");";

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

function guardarDatosContacto(
    IdContacto,
    IdOficina,
    IdPuesto,
    nombreContacto,
    telefonoOficina,
    extTelefono,
    celular,
    mail,
    cumpleanos,
    esVisible, callback){

    console.log("id contacto prueba:"+IdContacto);
   
    let sql = "call contacto_put("
    + IdContacto+","+
    IdOficina + ","+ 
    IdPuesto+ ",'"+ 
    nombreContacto+ "','"+ 
    telefonoOficina + "','"+ 
    extTelefono + "','"+  
    celular    + "','"+ 
    mail + "','"+ 
    cumpleanos + "',"+ 
    esVisible+");"
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
    obtenerTodosContactos,
    obtenerContactoPorId,
    guardarDatosContacto
}



