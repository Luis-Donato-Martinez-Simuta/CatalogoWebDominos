const db = require('../config/database');

//Con esta funcion logue al usuario
function logueo(username ,password,callback) {

    let sql = "call logueo('"+username+"','"+password+"');";

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

function obtenerUsuarioPorId(IdUsuario,callback) {

    let sql = "call obtenerUsuarioPorId("+IdUsuario+");";
    console.log("Sql: "+sql);
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

function obtenerTodosUsuarios(callback) {

    let sql = "call obtenerTodosUsuarios();";

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

function guardarDatosUsuario(IdUsuarioVer,nombreCompleto,username,pass,mail,telefono, direccion,esAdministrador,status,callback){

    let sql = `call rhchia_db_erp.usuarios_put(
        '`+IdUsuarioVer +`', 
        '`+nombreCompleto+`', 
        '`+username+`', 
        '`+pass +`',
        '`+mail+`',
        '`+telefono+`', 
        '`+direccion+`', 
        '`+esAdministrador+`',
        '`+status+`'
        );`;
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
    logueo,
    obtenerUsuarioPorId,
    obtenerTodosUsuarios,
    guardarDatosUsuario
}

