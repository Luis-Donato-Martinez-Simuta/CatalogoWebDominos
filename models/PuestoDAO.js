
const db = require('../config/database');

//Con esta funcion logue al usuario
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


function obtenerEmpresaPorId(IdEmpresa,callback) {
    console.log("id empresa uno: "+ IdEmpresa)

    let sql = "call obtenerEmpresaPorId("+IdEmpresa+");";

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

function guardarDatosEmpresa(
    IdEmpresa, 
    nombreEmpresa, 
    domicilio, 
    numeroInterior, 
    numeroExterior, 
    colonia, 
    ciudad, 
    estado, 
    pais, 
    CP, 
    status, callback) {
    //console.log("id empresa uno: "+ IdEmpresa)

    let sql = `call empresa_put(`+ IdEmpresa + `,'`+ nombreEmpresa+`','`+domicilio+`','`+numeroInterior+`','`+numeroExterior+`','`+colonia+`','`+ciudad+`','`+estado+`','`+pais+`','`+CP+`','`+status+`');;`
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
    obtenerTodosPuestos,
    obtenerEmpresaPorId,
    guardarDatosEmpresa
}



