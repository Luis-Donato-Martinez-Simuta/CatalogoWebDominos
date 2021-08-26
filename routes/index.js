var express = require('express');
var router = express.Router();
let CCDAO = require('../models/CentroCostoDAO');
let UsuarioDAO = require('../models/UsuariosDAO');
let franquiciaDAO = require('../models/FranquiciasDAO');
let empresaDAO = require('../models/EmpresaDAO');
let tipoUnidadDAO = require('../models/TipoUnidad');
let propiedadesDAO = require('../models/PopiedadesDAO');
//let calendario = require('../models/calendario');
var md5 = require("md5");
/*
const {
  Router
} = require('express');
*/

//Vista del acerca de (about)
router.post('/about', function (req, res, next) {
  let {
    IdUsuario
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    res.render('about', {
      usuario: usuario
    });
  });
});


//Esta funcion te manda a la pagina de logue 
router.get('/', function (req, res, next) {


  propiedadesDAO.getPropiedades((data)=>{
    let enCostruccion = data.enCostrusccion;
    console.log(enCostruccion)
    
    if (enCostruccion){
      res.render('construccion');
    }else{
      res.render('login');
    }
  
  });


  
});

//Si se quiere entrar al sistema con el link primero le pedira que se logue
router.get('/*', function (req, res, next) {

  propiedadesDAO.getPropiedades((data)=>{
    let enCostruccion = data.enCostrusccion;
    console.log(enCostruccion)
    
    if (enCostruccion){
      res.render('construccion');
    }else{
      res.render('login');
    }
  
  });
});


//Manda a llamar el login cuando el usuarios quiere salir del sistema
router.get('/irLogin', function (req, res, next) {
  res.render('login');
});

//Se manda a llamar cuando la vista esta en construccion
router.post('/enConstruccion', function (req, res, next) {
  res.render('construccion');
});


//Madnamos a llamar la pantalla de los centros de costo
router.post('/verListaCentrosCosto', function (req, res, next) {
  //Recuperamos el Id del usuario en la pantalla
  let {
    IdUsuario
  } = req.body;

  //Obtenemos el Usuario para tener de referencia en la pantalla
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    //console.log(usuario)
    //Obtenemos todos los centros de cosostos
    CCDAO.obtenerCentrosCostoPorFranquicia(usuario.IdUsuario, usuario.IdFranquicia, (data) => {
      listaCentrosCosotos = data;
      //Rendirizamos la pantalla de lista de centros de costo
      res.render('administracion/listas/listaCentroCostos', {
        listaCentrosCosotos: listaCentrosCosotos,
        usuario: usuario
      });
    });
  });
});


//Ver mis centros de costo
router.post('/verMisCentrosCosto', function (req, res, next) {
  let {
    IdUsuario,
    IdFranquicia
  } = req.body;
  CCDAO.obtenerCentrosCostoPorFranquicia(IdUsuario, IdFranquicia, (data) => {
    listaCentrosCosotos = data;
    console.log("lista centro: " + listaCentrosCosotos)
    //Rendirizamos la pantalla de lista de centros de costo
    res.render('administracion/listas/listaCentroCostos', {
      listaCentrosCosotos: listaCentrosCosotos,
      usuario: usuario
    });
  });
});

//Madnamos a llamar la pantalla para ver un solo centro de costo
router.post('/verCentroCosto', function (req, res, next) {
  //Recuperamos el Id del usuario y del centro de costo para capturar en la pantalla
  let {
    IdCentroCosto,
    IdUsuario
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    //console.log(usuario);

    CCDAO.obtenerCentroCostoID(IdCentroCosto, (data) => {
      let centroCosto = data;
      console.log(centroCosto);

      empresaDAO.obtenerTodasEmpresas((data) => {
        let listaEmpresas = data
        //console.log(listaEmpresas);

        franquiciaDAO.obtenerTodasFranquicias((data) => {
          let listaFranquicias = data;
          //console.log(listaFranquicias);

          tipoUnidadDAO.obtenerTodosTipoUnidad((data) => {
            let listaTipoUnidades = data;
            //console.log(listaTipoUnidades);
            res.render('administracion/unosolo/verUnCentroCosto', {
              usuario: usuario,
              centroCosto: centroCosto,
              listaEmpresas: listaEmpresas,
              listaFranquicias: listaFranquicias,
              listaTipoUnidades: listaTipoUnidades,
              tipoMensaje: 0
            });
          });
        });
      });
    });
  });
});


//Madnamos a llamar la pantalla de las empresas
router.post('/verListaEmpresas', function (req, res, next) {
  //Recuperamos el Id del usuario en la pantalla
  let {
    IdUsuario
  } = req.body;
  //Obtenemos el Usuario para tener de referencia en la pantalla    
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    usuario = data;
    //Obtenemos todas las empresas
    empresaDAO.obtenerTodasEmpresas((data) => {
      listaEmpresas = data;
      //Rendirizamos la pantalla de lista de empresas
      res.render('administracion/listas/listaEmpresas', {
        listaEmpresas: listaEmpresas,
        usuario: usuario
      });
    });
  });
});

//funcion un solo empresa
router.post('/verEmpresa', function (req, res, next) {
  let {
    IdEmpresa,
    IdUsuario
  } = req.body;

  console.log("id empresa: " + IdEmpresa)

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    empresaDAO.obtenerEmpresaPorId(IdEmpresa, (data) => {
      empresa = data;

      console.log("empresa:", empresa)
      res.render('administracion/unosolo/verUnaEmpresa', {
        empresa: empresa,
        usuario: usuario
      });
    });
  });



});


//Madnamos a llamar la pantalla de las franquicias
router.post('/verListaFranquicias', function (req, res, next) {
  //Recuperamos el Id del usuario en la pantalla
  let {
    IdUsuario
  } = req.body;
  //Obtenemos el Usuario para tener de referencia en la pantalla
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    usuario = data;
    //Obtenemos todas las franquicias    
    franquiciaDAO.obtenerTodasFranquicias((data) => {
      listaFranquicia = data;
      //Rendirizamos la pantalla de lista de franquicias
      res.render('administracion/listas/listaFranquicias', {
        listaFranquicia: listaFranquicia,
        usuario: usuario
      });
    });
  });
});




router.post('/verUnaFranquicia', function (req, res, next) {
  let {
    IdFranquicia,
    IdUsuario
  } = req.body;

  console.log("id franquicia: " + IdFranquicia)
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    franquiciaDAO.obtenerFranquiciaPorId(IdFranquicia, (data) => {
      franquicia = data;

      console.log("franquicia:", franquicia)
      res.render('administracion/unosolo/verUnaFranquicia', {
        franquicia: franquicia,
        usuario: usuario,
        tipoMensaje: 0
      });
    });
  });
});

//Madnamos a llamar la pantalla de tipo unidad
router.post('/verListaTipoUnidad', function (req, res, next) {
  //Recuperamos el Id del usuario en la pantalla
  let {
    IdUsuario
  } = req.body;
  //Obtenemos el Usuario para tener de referencia en la pantalla
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    usuario = data;
    //Obtenemos todas los tipos de unidad 
    tipoUnidadDAO.obtenerTodosTipoUnidad((data) => {
      listaTipoUnidad = data;
      //Rendirizamos la pantalla de lista de tipos de unidad
      res.render('administracion/listas/listaTipoUnidades', {
        listaTipoUnidad: listaTipoUnidad,
        usuario: usuario
      });
    });
  });
});


router.post('/verTipoUnidad', function (req, res, next) {
  let {
    IdTipoUnidad,
    IdUsuario

  } = req.body;

  //console.log("id tipo: "+IdTipoUnidad)
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    tipoUnidadDAO.obtenerTipoUnidadPorId(IdTipoUnidad, (data) => {
      tipoUnidad = data;

      //console.log("tipo unidad:", tipoUnidad)
      res.render('administracion/unosolo/verUnTipoUnidad', {
        tipoUnidad: tipoUnidad,
        usuario: usuario,
        tipoMensaje: 0
      });
    });
  });
});

//Madnamos a llamar la pantalla de lista de usuarios
router.post('/verListaUsuarios', function (req, res, next) {
  //Recuperamos el Id del usuario en la pantalla
  let {
    IdUsuario
  } = req.body;
  //Obtenemos el Usuario para tener de referencia en la pantalla
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    usuario = data;
    //Obtenemos todas los usuarios
    UsuarioDAO.obtenerTodosUsuarios((data) => {
      listaUsuarios = data;
      //Rendirizamos la pantalla de lista de lista de usuarios
      res.render('administracion/listas/listaUsuarios', {
        listaUsuarios: listaUsuarios,
        usuario: usuario
      });
    });
  });
});

//Fucion que permite hacer el laamado de logue del usuario
router.post('/logueo', async function (req, res, next) {
  //Obtenemos el nombre de usuario y la contraseña para buscarlo en el sistema
  let {
    username /*Nombre del usuario*/ ,
    password /*Contraseña del usuario*/
  } = req.body;
  //Incriptamos la contraseña del ususairo
  let passwordincriptado = md5(password);
  //Funcion que manda a llamar el logue en la base de datos
  UsuarioDAO.logueo(username, passwordincriptado, (data) => {
    usuario = data;
    //console.log(usuario);
    //Valida si el usuario existe en la base de datos
    if (usuario == null) {
      //Si el usuario no existe se regresa al login con un mensaje indicando
      //Acceso denegado
      res.render('login', {
        acceso: false
      });
    } else {
      //Si el usuario existe te manda a la pagina principal mostrando
      //Todos los centros de costo
      CCDAO.obtenerCentrosCostoPorFranquicia(usuario.IdUsuario, usuario.IdFranquicia, (data) => {
        listaCentrosCosotos = data;
        //console.log("lista centro: "+listaCentrosCosotos)
        //Rendirizamos la pantalla de lista de centros de costo
        res.render('administracion/listas/listaCentroCostos', {
          listaCentrosCosotos: listaCentrosCosotos,
          usuario: usuario
        });
      });
    }
  });
});

router.post("/miPerfil", function (req, res, next) {
  //Obtenemos el nombre de usuario y la contraseña para buscarlo en el sistema
  let {
    IdUsuario
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    UsuarioDAO.listBox_AsignarFranquicia((data) => {
      franquiciasListBox = data;
      //console.log(usuario);
      res.render('miPerfil', {
        usuario: usuario,
        franquiciasListBox:franquiciasListBox
      });
    });

  });

});

router.post('/guardarEmpresa', function (req, res, next) {
  let {
    IdUsuario,
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
    status
  } = req.body;
  console.log("Status desde el index" + status);
  empresaDAO.guardarDatosEmpresa(IdEmpresa, nombreEmpresa,
    domicilio,
    numeroInterior,
    numeroExterior,
    colonia,
    ciudad,
    estado,
    pais,
    CP,
    status, (data) => {
      let IdEmpresa = data.valor;
      if (data) {
        tipoMensaje = 1;
      } else {
        tipoMensaje = 2;
      }
      UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
        let usuario = data;
        empresaDAO.obtenerEmpresaPorId(IdEmpresa, (data) => {
          let empresa = data;
          console.log("empresa:", empresa)
          res.render('administracion/unosolo/verUnaEmpresa', {
            empresa: empresa,
            usuario: usuario,
            tipoMensaje: tipoMensaje
          });
        });
      });

    });
});

router.post('/nuevaEmpresa', function (req, res, next) {
  let {
    IdUsuario
  } = req.body;

  let empresa = {
    idEmpresa: '0',
    nombreEmpresa: '',
    domicilio: '',
    numeroInterior: '',
    numeroExterior: '',
    colonia: '',
    ciudad: '',
    estado: '',
    pais: '',
    CP: '',
    status: true
  }

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;

    res.render('administracion/unosolo/verUnaEmpresa', {
      empresa: empresa,
      usuario: usuario
    });

  });

});

router.post('/guardarCentroCosto', function (req, res, next) {
  //console.log("Iniciando guardado");
  let {
    IdUsuario,
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
  } = req.body;
  console.log("Desde la vista " + numeroInterior)
  CCDAO.guardarDatosCentroCosto2(IdCentroCosto, UDN, IdEmpresa, IdFranquicia, IdTipoUnidad, nombreCentroCosto,
    nombreGerente, mailGerente, nombresubGerente, telefono, estado, ciudad, direccion, numeroInterior, numeroExterior,
    colonia, CP, status, (data) => {
      IdCentroCosto = data.IdTemp;
      let tipoMensaje;
      if (data) {
        tipoMensaje = 1;
      } else {
        tipoMensaje = 2;
      }
      //console.log(respuesta);
      UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
        let usuario = data;
        //console.log(usuario);
        CCDAO.obtenerCentroCostoID(IdCentroCosto, (data) => {
          let centroCosto = data;
          //console.log(centroCosto);
          empresaDAO.obtenerTodasEmpresas((data) => {
            let listaEmpresas = data
            //console.log(listaEmpresas);
            franquiciaDAO.obtenerTodasFranquicias((data) => {
              let listaFranquicias = data;
              //console.log(listaFranquicias);
              tipoUnidadDAO.obtenerTodosTipoUnidad((data) => {
                let listaTipoUnidades = data;
                //console.log(listaTipoUnidades);
                res.render('administracion/unosolo/verUnCentroCosto', {
                  usuario: usuario,
                  centroCosto: centroCosto,
                  listaEmpresas: listaEmpresas,
                  listaFranquicias: listaFranquicias,
                  listaTipoUnidades: listaTipoUnidades,
                  tipoMensaje: tipoMensaje
                });
              });
            });
          });
        });
      });
    }
  );
});


router.post('/nuevoCentroCosto', function (req, res, next) {
  //console.log("Iniciando nuevo")
  let {
    IdUsuario,
    agregar
  } = req.body;
  let centroCosto = {
    idCentroCosto: 0,
    UDN: '',
    IdEmpresa: 0,
    IdFranquicia: 0,
    IdTipoUnidad: 0,
    nombreCentroCosto: '',
    nombreGerente: '',
    mailGerente: '',
    nombresubGerente: '',
    telefono: '',
    estado: '',
    ciudad: '',
    direccion: '',
    numeroInterior: '',
    numeroExterior: '',
    colonia: '',
    CP: '',
    status: true
  };
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    //console.log(usuario);
    empresaDAO.obtenerTodasEmpresas((data) => {
      let listaEmpresas = data
      //console.log(listaEmpresas);

      franquiciaDAO.obtenerTodasFranquicias((data) => {
        let listaFranquicias = data;
        //console.log(listaFranquicias);

        tipoUnidadDAO.obtenerTodosTipoUnidad((data) => {
          let listaTipoUnidades = data;
          //console.log(listaTipoUnidades);
          res.render('administracion/unosolo/verUnCentroCosto', {
            usuario: usuario,
            centroCosto: centroCosto,
            listaEmpresas: listaEmpresas,
            listaFranquicias: listaFranquicias,
            listaTipoUnidades: listaTipoUnidades,
            tipoMensaje: 0,
            agregar: agregar
          });
        });
      });
    });

  });
});

router.post('/guardarFranquicia', function (req, res, next) {
  let {
    IdUsuario,
    IdFranquicia,
    nombreFranquicia,
    status
  } = req.body;
  console.log("Status desde el index" + status);
  franquiciaDAO.guardarDatosFranquicia(IdFranquicia, nombreFranquicia, status, (data) => {
    let IdFranquicia = data.valor;

    let tipoMensaje;
    if (data) {
      tipoMensaje = 1;
    } else {
      tipoMensaje = 2;
    }

    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      franquiciaDAO.obtenerFranquiciaPorId(IdFranquicia, (data) => {
        let franquicia = data;
        console.log("franquicia:", franquicia)
        res.render('administracion/unosolo/verUnaFranquicia', {
          franquicia: franquicia,
          usuario: usuario,
          tipoMensaje: tipoMensaje
        });
      });
    });

  });
});



router.post('/nuevaFranquicia', function (req, res, next) {
  let {
    IdUsuario
  } = req.body;

  let franquicia = {
    idFranquicia: '0',
    nombreFranquicia: '',
    status: true
  }

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;

    res.render('administracion/unosolo/verUnaFranquicia', {
      franquicia: franquicia,
      usuario: usuario,
      tipoMensaje: 0
    });

  });

});

router.post('/guardarTipoUnidad', function (req, res, next) {
  let {
    IdUsuario,
    IdTipoUnidad,
    nombreTipo,
    orden,
    status
  } = req.body;
  console.log("Status desde el index" + status);

  tipoUnidadDAO.guardarDatosTipoUnidad(IdTipoUnidad, nombreTipo, orden, status, (data) => {
    let IdTipoUnidad = data.valor;
    let tipoMensaje;
    if (data) {
      tipoMensaje = 1;
    } else {
      tipoMensaje = 2;
    }

    console.log("mensaje: " + tipoMensaje)
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      tipoUnidadDAO.obtenerTipoUnidadPorId(IdTipoUnidad, (data) => {
        let tipoUnidad = data;
        console.log("tipo unidad:", tipoUnidad)
        res.render('administracion/unosolo/verUnTipoUnidad', {
          tipoUnidad: tipoUnidad,
          usuario: usuario,
          tipoMensaje: tipoMensaje
        });
      });
    });

  });

});

router.post('/nuevoTipoUnidad', function (req, res, next) {
  let {
    IdUsuario
  } = req.body;

  let tipoUnidad = {
    IdTipoUnidad: '0',
    nombreTipo: '',
    orden: '',
    status: true
  }

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;

    res.render('administracion/unosolo/verUnTipoUnidad', {
      tipoUnidad: tipoUnidad,
      usuario: usuario,
      tipoMensaje: 0
    });

  });

});

router.post("/verUsuario", function (req, res, next) {
  //Obtenemos el nombre de usuario y la contraseña para buscarlo en el sistema
  let {
    IdUsuarioLista,
    IdUsuario
  } = req.body;
  console.log('Pss')
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    UsuarioDAO.obtenerUsuarioPorId(IdUsuarioLista, (data) => {
      usuarioVer = data;
      console.log(usuario);
      UsuarioDAO.listBox_AsignarFranquicia((data) => {
        let franquiciasListBox = data;
        res.render('administracion/unosolo/verUnUsuario', {
          usuario: usuario,
          usuarioVer: usuarioVer,
          tipoMensaje: 0,
          franquiciasListBox: franquiciasListBox

        });
      });

    });

  });

});


router.post('/guardarUsuario', function (req, res, next) {
  let = {
    IdFranquicia,
    idtemp,
    IdUsuarioVer,
    nombreCompleto,
    username,
    mail,
    telefono,
    direccion,
    esAdministrador,
    status
  } = req.body;

  UsuarioDAO.guardarDatosUsuario(IdUsuarioVer, nombreCompleto, username, '', mail, telefono, direccion, esAdministrador, status, IdFranquicia, (data) => {
    let IdUsuariover = data.valor;
    console.log(IdUsuariover);
    UsuarioDAO.obtenerUsuarioPorId(IdUsuariover, (data) => {
      let usuarioVer = data;
      UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
        let usuario = data;
        UsuarioDAO.listBox_AsignarFranquicia((data) => {
          franquiciasListBox = data;
          res.render('administracion/unosolo/verUnUsuario', {
            usuario: usuario,
            usuarioVer: usuarioVer,
            tipoMensaje: 1,
            franquiciasListBox: franquiciasListBox
          });
        });


      });
    });
  });
});


router.post('/nuevoUsuario', function (req, res, next) {
  let = {
    IdUsuario
  } = req.body;
  let nuevoUsuario = {
    IdUsuario: 0,
    nombreCompleto: ' ',
    username: ' ',
    pass: ' ',
    mail: '',
    telefono: '',
    direccion: '',
    tipoUsuario: 3,
    status: true
  };

  console.log(nuevoUsuario);

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data => {
    usuario = data;

    UsuarioDAO.listBox_AsignarFranquicia((data) => {
      let franquiciasListBox = data;
      console.log(franquiciasListBox);
      res.render('administracion/unosolo/nuevoUsuario', {
        usuario: usuario,
        usuarioVer: nuevoUsuario,
        tipoMensaje: 0,
        franquiciasListBox: franquiciasListBox
      });
    });

  }));
});

router.post('/guardarNuevoUsuario', function (req, res, next) {
  let = {
    idtemp,
    IdUsuarioVer,
    confirmPass,
    pass,
    nombreCompleto,
    username,
    mail,
    telefono,
    direccion,
    esAdministrador,
    status,
    IdFranquicia
  } = req.body;


  if (confirmPass === pass) {
    console.log('Si pasa')
    let passwordincriptado = md5(pass);
    UsuarioDAO.guardarDatosUsuario(IdUsuarioVer, nombreCompleto, username, passwordincriptado, mail, telefono, direccion, esAdministrador, status, IdFranquicia, (data) => {
      let IdUsuariover = data.valor;
      console.log(IdUsuariover);
      UsuarioDAO.obtenerUsuarioPorId(IdUsuariover, (data) => {
        let usuarioVer = data;
        UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
          let usuario = data;
          UsuarioDAO.listBox_AsignarFranquicia((data) => {
            franquiciasListBox = data;
            res.render('administracion/unosolo/verUnUsuario', {
              usuario: usuario,
              usuarioVer: usuarioVer,
              tipoMensaje: 1,
              franquiciasListBox: franquiciasListBox
            });
          });

        });
      });
    });

  } else {
    console.log('no pasa');
    let nuevoUsuario = {
      IdUsuario: 0,
      nombreCompleto: ' ',
      username: ' ',
      pass: ' ',
      mail: '',
      telefono: '',
      direccion: '',
      esAdministrador: false,
      status: true
    };
    UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
      let usuario = data;
      res.render('administracion/unosolo/nuevoUsuario', {
        usuario: usuario,
        usuarioVer: nuevoUsuario,
        tipoMensaje: 3
      });
    });

  }



});


router.post('/cambiarPass', function (req, res, next) {
  let = {
    IdUsuarioVer,
    IdUsuario
  } = req.body;


  UsuarioDAO.obtenerUsuarioPorId(IdUsuarioVer, (data) => {
    let usuarioVer = data;
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario , (data)=>{
      usuario = data;
      res.render('cambiarPass', {
        usuario: usuario,
        usuarioVer:usuarioVer
      })
    });
  })

});

router.post('/guardarNuevoPass', function (req, res, next) {
  let = {
    idtemp,
    IdUsuarioVer,
    confirmPass,
    pass,
  } = req.body;

  console.log(pass + " ==? " + confirmPass);
  if (confirmPass === pass) {
    console.log('Si pasa')
    let passwordincriptado = md5(pass);
    UsuarioDAO.usuarioPass_put(IdUsuarioVer, passwordincriptado, (data) => {
      let IdUsuariover = data.valor;
      console.log(IdUsuariover);
      UsuarioDAO.obtenerUsuarioPorId(IdUsuariover, (data) => {
        let usuarioVer = data;
        UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
          let usuario = data;
          res.render('cambiarPass', {
            usuario: usuario,
            usuarioVer: usuarioVer,
            tipoMensaje: 1
          });
        });
      });
    });

  } else {
    console.log('no pasa');
    UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
      let usuario = data;
      res.render('cambiarPass', {
        usuario: usuario,
        tipoMensaje: 3
      });
    });

  }



});


/*Apartado para la generacion de reportes*/

/*Esta ruta genera el reporte que contiene a todos los centros de costos 
con su informacion, tambien idica quien elabora el reporte fecha y hora*/
router.post('/reporteCentroCosto', function (req, res, next) {
  //capturamos el id del usuario para mostrar en el reporte
  let {
    IdUsuario,
    IdFranquicia
  } = req.body;
  //Obtenemos todos todas las unidades
  CCDAO.obtenerCentrosCostoPorFranquicia( IdUsuario, IdFranquicia, (data) => {
    let centroCosto = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      console.log(fecha + ' las ' + hora);
      //Renderizamos la vista del reporte
      res.render('administracion/reportes/reporteCentrosCosto', {
        centroCosto: centroCosto,
        usuario: usuario,
        fecha: fecha,
        hora: hora
      });
    })
  });
});

/*Esta ruta genera el reporte que contiene a todas las empresas
con su informacion, tambien idica quien elabora el reporte fecha y hora*/
router.post('/reporteEmpresas', function (req, res, next) {
  //capturamos el id del usuario para mostrar en el reporte
  let {
    IdUsuario
  } = req.body;
  //Obtenemos todos todas las empresas
  empresaDAO.obtenerTodasEmpresas((data) => {
    let listadoEmpresas = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      console.log(fecha + ' las ' + hora);
      //Renderizamos la vista del reporte
      res.render('administracion/reportes/reporteEmpresas', {
        listadoEmpresas: listadoEmpresas,
        usuario: usuario,
        fecha: fecha,
        hora: hora
      });
    })

  });
});



/*Esta ruta genera el reporte que contiene a todos los tipo de unidad
con su informacion, tambien idica quien elabora el reporte fecha y hora*/
router.post('/reporteTipoUnidad', function (req, res, next) {
  //capturamos el id del usuario para mostrar en el reporte
  let {
    IdUsuario
  } = req.body;
  //Obtenemos todos todas las empresas
  tipoUnidadDAO.obtenerTodosTipoUnidad((data) => {
    let listadoTipoUnidad = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      console.log(fecha + ' las ' + hora);
      //Renderizamos la vista del report
      res.render('administracion/reportes/reporteTiposUnidad', {
        listadoTipoUnidad: listadoTipoUnidad,
        usuario: usuario,
        fecha: fecha,
        hora: hora
      });
    })
  });
});

/*Esta ruta genera el reporte que contiene a todas la franquicias
con su informacion, tambien idica quien elabora el reporte fecha y hora*/
router.post('/reporteFranquicia', function (req, res, next) {
  //capturamos el id del usuario para mostrar en el reporte
  let {
    IdUsuario
  } = req.body;
  //Obtenemos todos todas la franquicias
  franquiciaDAO.obtenerTodasFranquicias((data) => {
    let listadoFranquicias = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      console.log(fecha + ' las ' + hora);
      //Renderizamos la vista del report
      res.render('administracion/reportes/reporteFranquicias', {
        listadoFranquicias: listadoFranquicias,
        usuario: usuario,
        fecha: fecha,
        hora: hora
      });
    })
  });
});

/*Esta ruta genera el reporte que contiene a todos los usuarios
con su informacion, tambien idica quien elabora el reporte fecha y hora*/
router.post('/reporteUsuarios', function (req, res, next) {
  //capturamos el id del usuario para mostrar en el reporte
  let {
    IdUsuario
  } = req.body;
  //Obtenemos todos todos los usuarios
  UsuarioDAO.obtenerTodosUsuarios((data) => {
    let listadoUsuarios = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      console.log(fecha + ' las ' + hora);
      //Renderizamos la vista del report
      res.render('administracion/reportes/reporteUsuarios', {
        listadoUsuarios: listadoUsuarios,
        usuario: usuario,
        fecha: fecha,
        hora: hora
      });
    })
  });
});



module.exports = router;