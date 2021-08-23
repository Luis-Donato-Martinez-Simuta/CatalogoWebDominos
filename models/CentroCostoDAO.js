const db = require('../config/database');

//Con esta funcion obtengo todas las unidades en la base de datos
function obtenerTodasUnidades(callback) {
    let sql = "call obtenerTodosCentroCosto()";
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

function obtenerCentroCostoID(IdCentroCosto,callback) {
    //console.log("id centro costo uno: "+ IdCentroCosto)
    let sql = "call obtenerCentroCostoID("+IdCentroCosto+");";
    //console.log("Desde el DAO");

    db.query(sql, (err, data) => {
        //console.log(data[0][0]);
        if (err) {
            throw err
        };
        if (data.length > 0) {
            return callback(data[0][0]);
        };

        return callback(null);
    });
}

function guardarDatosCentroCosto(centroCost , callback){
    //console.log("id centro costo uno: "+ IdCentroCosto)
    let sql = "call obtenerCentroCostoID("
			+
            centroCost.IdCentroCosto + ",'"+
            centroCost.UDN + "',"+ 
			centroCost.IdEmpres+ ","+ 
			centroCost.IdFranquicia+ ","+ 
			centroCost.IdTipoUnidad + ","+ 
			centroCost.nombreCentroCosto + "','"+  
			centroCost.nombreGerente + "','"+ 
			centroCost.mailGerente + "','"+ 
			centroCost.nombresubGerente + "','"+ 
			centroCost.telefono +"','"+ 
			centroCost.estado + "','" + 
		    centroCost.ciudad + "'," +  
			"'" + centroCost.direccion + "'," + 
			centroCost.numeroInterior + "," +  
			centroCost.numeroExterior + ","+ 
			"'"+centroCost.colonia + "','" +
			centroCost.CP + "',"
			+centroCost.status+");"
    //console.log("Desde el DAO");
    db.query(sql, (err, data) => {
        //console.log(data[0][0]);
        if (err) {
            throw err
        };
        if (data.length > 0) {
            return callback(data[0][0]);
        };

        return callback(null);
    });
}

function guardarDatosCentroCosto2(
    IdCentroCosto,
    UDN, 
    IdEmpresa, 
    IdFranquicia, 
    IdTipoUnidad, 
    nombreCentroCosto, 
    nombreGerente, 
    mailGerente, 
    nombresubGerente, 
    telefono, 
    estado, 
    ciudad, 
    direccion, 
    numeroInterior, 
    numeroExterior, 
    colonia,
    CP,
    status
    , callback){
    //console.log("id centro costo uno: "+ IdCentroCosto)
    let sql = "call centroCosto_put("
			+ IdCentroCosto+",'"+
            UDN + "',"+ 
			IdEmpresa+ ","+ 
			IdFranquicia+ ","+ 
			IdTipoUnidad + ",'"+ 
			nombreCentroCosto + "','"+  
			nombreGerente + "','"+ 
			mailGerente + "','"+ 
			nombresubGerente + "','"+ 
			telefono +"','"+ 
			estado + "','" + 
		    ciudad + "'," +  
			"'" + direccion + "','" + 
			numeroInterior + "','" +  
			numeroExterior + "',"+ 
			"'"+colonia + "','" +
			CP + "'," + status+");"
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
    obtenerTodasUnidades,
    obtenerCentroCostoID,
    guardarDatosCentroCosto2,
    guardarDatosCentroCosto
}

