var express = require('express');
var router = express.Router();
let CCDAO = require('../models/CentroCostoDAO');
let UsuarioDAO = require('../models/UsuariosDAO');
let franquiciaDAO = require('../models/FranquiciasDAO');
let empresaDAO = require('../models/EmpresaDAO');
let tipoUnidadDAO = require('../models/TipoUnidad');
let propiedadesDAO = require('../models/PopiedadesDAO');
let ContactosDAO = require('../models/ContactosDAO');
let OficinaDAO = require('../models/OficinaDAO')
let PuestoDAO = require('../models/PuestoDAO');
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
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
    //console.log(enCostruccion)
    if (enCostruccion) {
      res.render('construccion');
    } else {
      res.render('login');
    }
  });
});

//Si se quiere entrar al sistema con el link primero le pedira que se logue
/*
router.get('/*', function (req, res, next) {
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
    //console.log(enCostruccion)
    if (enCostruccion) {
      res.render('construccion');
    } else {
      res.render('login');
    }
  });
});
*/

//Manda a llamar el login cuando el usuarios quiere salir del sistema
router.get('/irLogin', function (req, res, next) {
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
    res.render('login');
  })
});

//Se manda a llamar cuando la vista esta en construccion
router.post('/enConstruccion', function (req, res, next) {
  res.render('construccion');
});


//ruta para buscar un centro de costo
router.post('/buscarCentroCosto', function (req, res, next) {
  let {
    IdUsuario,
    valor,
    tipo
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    //console.log("Tipo: ", tipo)
    CCDAO.buscarCentroCosto(valor, tipo, (data) => {
      let listaCentrosCosotos = data;
      let contResultados = listaCentrosCosotos.length
      //console.log("tama??o lista: ",listaCentrosCosotos.length);
      res.render('administracion/listas/listaCentroCostos', {

        listaCentrosCosotos: listaCentrosCosotos,
        usuario: usuario,
        valor: valor,
        tipo: tipo,
        contResultados: contResultados
      });
    });
  });
});

//Madnamos a llamar la pantalla de los centros de costo
router.post('/verListaCentrosCosto', function (req, res, next) {
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
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
        let contResultados = listaCentrosCosotos.length
        //Rendirizamos la pantalla de lista de centros de costo
        if (enCostruccion) {
          res.render('construccion');
        } else {


          res.render('administracion/listas/listaCentroCostos', {
            listaCentrosCosotos: listaCentrosCosotos,
            usuario: usuario,
            valor: "",
            contResultados: contResultados
          });
        }
      });
    });
  })
});


//Madnamos a llamar la pantalla para ver un solo centro de costo
router.post('/verCentroCosto', function (req, res, next) {
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
    console.log("Pss")
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
        //console.log(centroCosto);

        empresaDAO.obtenerTodasEmpresas((data) => {
          let listaEmpresas = data
          console.log(listaEmpresas);

          franquiciaDAO.obtenerTodasFranquicias((data) => {
            let listaFranquicias = data;
            //console.log(listaFranquicias);

            tipoUnidadDAO.obtenerTodosTipoUnidad((data) => {
              let listaTipoUnidades = data;
              //console.log(listaTipoUnidades);
              if (enCostruccion) {
                res.render('construccion');
              } else {


                res.render('administracion/unosolo/verUnCentroCosto', {
                  usuario: usuario,
                  centroCosto: centroCosto,
                  listaEmpresas: listaEmpresas,
                  listaFranquicias: listaFranquicias,
                  listaTipoUnidades: listaTipoUnidades,
                  tipoMensaje: 0
                });
              }
            });
          });
        });
      });
    });
  })
});


//Madnamos a llamar la pantalla de las empresas
router.post('/verListaEmpresas', function (req, res, next) {
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
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
        if (enCostruccion) {
          res.render('construccion');
        } else {


          res.render('administracion/listas/listaEmpresas', {
            listaEmpresas: listaEmpresas,
            usuario: usuario
          });
        }
      });
    });
  })
});

//funcion un solo empresa
router.post('/verEmpresa', function (req, res, next) {
  let {
    IdEmpresa,
    IdUsuario
  } = req.body;

  //console.log("id empresa: " + IdEmpresa)

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    empresaDAO.obtenerEmpresaPorId(IdEmpresa, (data) => {
      empresa = data;

      //console.log("empresa:", empresa)
      res.render('administracion/unosolo/verUnaEmpresa', {
        empresa: empresa,
        usuario: usuario,
        tipoMensaje: 0
      });
    });
  });


});


//Madnamos a llamar la pantalla de las franquicias
router.post('/verListaFranquicias', function (req, res, next) {
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
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
        if (enCostruccion) {
          res.render('construccion');
        } else {


          //Rendirizamos la pantalla de lista de franquicias
          res.render('administracion/listas/listaFranquicias', {
            listaFranquicia: listaFranquicia,
            usuario: usuario
          });
        }
      });
    });
  })
});




router.post('/verUnaFranquicia', function (req, res, next) {
  let {
    IdFranquicia,
    IdUsuario
  } = req.body;

  //console.log("id franquicia: " + IdFranquicia)
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    franquiciaDAO.obtenerFranquiciaPorId(IdFranquicia, (data) => {
      franquicia = data;

      //console.log("franquicia:", franquicia)
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
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
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
        if (enCostruccion) {
          res.render('construccion');
        } else {


          //Rendirizamos la pantalla de lista de tipos de unidad      
          res.render('administracion/listas/listaTipoUnidades', {
            listaTipoUnidad: listaTipoUnidad,
            usuario: usuario
          });
        }
      });
    });
  })
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
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
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
        if (enCostruccion) {
          res.render('construccion');
        } else {


          //Rendirizamos la pantalla de lista de lista de usuarios
          res.render('administracion/listas/listaUsuarios', {
            listaUsuarios: listaUsuarios,
            usuario: usuario
          });
        }
      });

    });
  })
});

//Fucion que permite hacer el laamado de logue del usuario
router.post('/logueo', async function (req, res, next) {
  //Obtenemos el nombre de usuario y la contrase??a para buscarlo en el sistema
  let {
    username /*Nombre del usuario*/ ,
    password /*Contrase??a del usuario*/
  } = req.body;
  //Incriptamos la contrase??a del ususairo
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
  propiedadesDAO.getPropiedades((data) => {
    let enCostruccion = data.enCostrusccion;
    //Obtenemos el nombre de usuario y la contrase??a para buscarlo en el sistema
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
          franquiciasListBox: franquiciasListBox,
          tipoMensaje: 0
        });
      });

    });
  })

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
  //console.log("Nombre Esmpresa desde el index" + nombreEmpresa);
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
          //console.log("empresa:", empresa)
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
    IdUsuario,
    guardar
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
      usuario: usuario,
      guardar: guardar,
      tipoMensaje: 0
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
  //console.log("Desde la vista IdFranquicia " + IdFranquicia)
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
    googleStreatView: '',
    status: true,
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
          console.log(centroCosto)
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
  //console.log("Status desde el index" + status);
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
        //console.log("franquicia:", franquicia)
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
    IdUsuario,
    agregar
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
      agregar: agregar,
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
    status,
  } = req.body;
  //console.log("Status desde el index" + status);

  tipoUnidadDAO.guardarDatosTipoUnidad(IdTipoUnidad, nombreTipo, orden, status, (data) => {
    let IdTipoUnidad = data.valor;
    let tipoMensaje;
    if (data) {
      tipoMensaje = 1;
    } else {
      tipoMensaje = 2;
    }

    //console.log("mensaje: " + tipoMensaje)
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      tipoUnidadDAO.obtenerTipoUnidadPorId(IdTipoUnidad, (data) => {
        let tipoUnidad = data;
        //console.log("tipo unidad:", tipoUnidad)
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
    IdUsuario,
    agregar
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
      agregar: agregar,
      tipoMensaje: 0
    });

  });

});

router.post("/verUsuario", function (req, res, next) {
  //Obtenemos el nombre de usuario y la contrase??a para buscarlo en el sistema
  let {
    IdUsuarioLista,
    IdUsuario
  } = req.body;
  //console.log('Pss')
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    UsuarioDAO.obtenerUsuarioPorId(IdUsuarioLista, (data) => {
      usuarioVer = data;
      //console.log(usuario);
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
    passMail,
    telefono,
    direccion,
    esAdministrador,
    status
  } = req.body;


  let cambiar = true;

  for (let i in mail) {
    //console.log(mail.charAt(i))
    if (mail.charAt(i) == '@') {
      console.log("Se encontro el @ IdUsuario");
      cambiar = false;
    }
  }

  if (cambiar) {
    UsuarioDAO.guardarDatosUsuario(IdUsuarioVer, nombreCompleto, username, '', mail, passMail, telefono, direccion, esAdministrador, status, IdFranquicia, (data) => {
      let IdUsuariover = data.valor;
      //console.log(IdUsuariover);
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
    //console.log(IdUsuarioVer)
    let Id = IdUsuarioVer;
    UsuarioDAO.obtenerUsuarioPorId(Id, (data) => {
      let usuarioVer = data;
      UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
        let usuario = data;
        UsuarioDAO.listBox_AsignarFranquicia((data) => {
          franquiciasListBox = data;
          res.render('administracion/unosolo/verUnUsuario', {
            usuario: usuario,
            usuarioVer: usuarioVer,
            tipoMensaje: 10,
            franquiciasListBox: franquiciasListBox,
            errorMail: mail
          });
        });
      });
    });
  }


});


router.post('/nuevoUsuario', function (req, res, next) {

  let = {
    IdUsuario
  } = req.body;

  let nuevoUsuario = {
    IdUsuario: 0,
    nombreCompleto: '',
    username: '',
    pass: '',
    mail: '',
    telefono: '',
    direccion: '',
    tipoUsuario: 3,
    status: true

  };

  //console.log(nuevoUsuario);

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data => {
    usuario = data;

    UsuarioDAO.listBox_AsignarFranquicia((data) => {
      let franquiciasListBox = data;
      //console.log(franquiciasListBox);
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
    mailPass,
    telefono,
    direccion,
    esAdministrador,
    status,
    IdFranquicia
  } = req.body;



  if (confirmPass === pass) {
    //console.log('Si pasa')
    let passwordincriptado = md5(pass);
    UsuarioDAO.guardarDatosUsuario(IdUsuarioVer, nombreCompleto, username, passwordincriptado, mail, mailPass, telefono, direccion, esAdministrador, status, IdFranquicia, (data) => {
      let IdUsuariover = data.valor;
      //console.log(IdUsuariover);
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
    //console.log('no pasa');
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
    //console.log("Usuario ver" + usuarioVer);
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      usuario = data;
      //console.log("Usuario ver" + usuario);
      res.render('cambiarPass', {
        usuario: usuario,
        usuarioVer: usuarioVer
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

  //console.log(pass + " ==? " + confirmPass);
  if (confirmPass === pass) {
    //console.log('Si pasa')
    let passwordincriptado = md5(pass);
    UsuarioDAO.usuarioPass_put(IdUsuarioVer, passwordincriptado, (data) => {
      let IdNuevoUsuariover = data.valor;
      //console.log("Nuevo Usuario: " + IdNuevoUsuariover);
      UsuarioDAO.obtenerUsuarioPorId(IdNuevoUsuariover, (data) => {
        let usuarioVer = data;
        //console.log("Usuario ver: " + usuarioVer);
        UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
          let usuario = data;
          //console.log("Usuario: " + usuario);
          res.render('cambiarPass', {
            usuario: usuario,
            usuarioVer: usuarioVer,
            tipoMensaje: 1
          });
        });
      });
    });

  } else {

    //console.log("no pasa");
    //console.log(idtemp)
    UsuarioDAO.obtenerUsuarioPorId(idtemp, (data) => {
      let usuario = data;
      //console.log("Usuario ver: " + usuario);

      UsuarioDAO.obtenerUsuarioPorId(IdUsuarioVer, (data) => {
        let usuarioVer = data;
        //console.log("Usuario ver: " + usuarioVer);
        res.render('cambiarPass', {
          usuario: usuario,
          usuarioVer: usuarioVer,
          tipoMensaje: 3
        });
      });

    });



  }



});




//Apartado para la parte de los contactos

//ruta para acceder al listado de contactos
router.post('/verListaContactos', function (req, res, next) {
  //Obtenemos el id del usuario que esta usuado la pagina
  let {
    IdUsuario
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    //Obtenemos el usuario en base a l id capturado
    usuario = data;
    //Mandamos a llamar la lista de contactos 
    ContactosDAO.obtenerTodosContactos((data) => {
      //Guardamos la lista de contactos en una variable de tipo lista
      let listaContactos = data;
      let contResultados = listaContactos.length

      //Rendierizamos la vista
      res.render('Contactos/listas/listaContactos', {
        usuario: usuario,
        listaContactos: listaContactos,
        contResultados: contResultados
      });
    });
  });
});


//ruta para buscar un centro de costo
router.post('/buscarContacto', function (req, res, next) {
  let {
    IdUsuario,
    valor,
    tipo
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    //console.log("Tipo: ", tipo)
    ContactosDAO.buescarContacto(valor, tipo, (data) => {
      let listaContactos = data;
      let contResultados = listaContactos.length
      //console.log("tama??o lista: ",listaCentrosCosotos.length);
      res.render('Contactos/listas/listaContactos', {

        listaContactos: listaContactos,
        usuario: usuario,
        valor: valor,
        tipo: tipo,
        contResultados: contResultados
      });
    });
  });
});

//Ruta para ver un solo contactos
router.post('/verUnContacto', function (req, res, next) {
  //console.log("Cargando contacto")
  //Obtenemos el id del usuario que usandola pagina y del contacto a ver??
  let {
    IdUsuario,
    IdContacto
  } = req.body;



  //mandamos a llamar al usuario
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    //guardamos el usuario en esta variable
    let usuario = data;

    //Mandamos a llamar al contacto
    ContactosDAO.obtenerContactoPorId(IdContacto, (data) => {
      //Guardamos al contacto en esta variable
      let contacto = data;
      //Obtenemos todas las litas de oficinas disponibles
      OficinaDAO.obtenerTodasOficinas((data) => {
        let listaOficinas = data
        //Renderisamos la vista
        PuestoDAO.obtenerTodosPuestos((data) => {
          let listaPuestos = data;
          console.log(listaOficinas)
          res.render('Contactos/unosolo/verUnContacto', {
            usuario: usuario,
            contacto: contacto,
            listaOficinas: listaOficinas,
            listaPuestos: listaPuestos,
            tipoMensaje: 0
          });
        });
      });
    });
  });
});

router.post('/guardarContacto', function (req, res, next) {
  //console.log("Inciando guardado de contactos");
  let {
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
    IdUsuario
  } = req.body;
  let tm = 1;
  if (esVisible == 0) {
    tm = 4;
  }

  //let esNumero = esNumeroTelefono(telefonoOficina);

  let cambiar = true;

  for (let i in mail) {
    //console.log(mail.charAt(i))
    if (mail.charAt(i) == '@') {
      cambiar = false;
      break;
    }
  }
  if (cambiar /*&& esNumero*/ ) {
    ContactosDAO.guardarContacto(IdContacto, IdOficina, IdPuesto, nombreContacto, telefonoOficina,
      extTelefono, celular, mail, cumpleanos, esVisible, (data) => {
        let IdContacto = data.valor;
        //console.log(IdContacto);
        ContactosDAO.obtenerContactoPorId(IdContacto, (data) => {
          contacto = data;
          UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
            usuario = data;
            OficinaDAO.obtenerTodasOficinas((data) => {
              let listaOficinas = data
              //Renderisamos la vista
              PuestoDAO.obtenerTodosPuestos((data) => {
                let listaPuestos = data;
                res.render('Contactos/unosolo/verUnContacto', {
                  usuario: usuario,
                  contacto: contacto,
                  listaOficinas: listaOficinas,
                  listaPuestos: listaPuestos,
                  tipoMensaje: tm
                });
              });
            });
          });
        });
      });
  } else {
    ContactosDAO.obtenerContactoPorId(IdContacto, (data) => {
      contacto = data;
      UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
        usuario = data;
        OficinaDAO.obtenerTodasOficinas((data) => {
          let listaOficinas = data
          //Renderisamos la vista
          PuestoDAO.obtenerTodosPuestos((data) => {
            let listaPuestos = data;
            res.render('Contactos/unosolo/verUnContacto', {
              usuario: usuario,
              contacto: contacto,
              listaOficinas: listaOficinas,
              listaPuestos: listaPuestos,
              tipoMensaje: 10,
              errorMail: mail //,
              //esNumero : esNumero 
            });
          });
        });
      });
    });
  }

});

//ruta para crear un nuevo contacto
router.post('/nuevoContacto', function (req, res, next) {
  //Obtenemos el Id del usuario que esta usando la pagina
  let {
    IdUsuario,
    agregar
  } = req.body;

  let contacto = {
    IdContacto: 0,
    IdOficina: 0,
    IdPuesto: 0,
    nombreContacto: "",
    telefonoOficina: "",
    extTelefono: "",
    celular: "",
    mail: "",
    cumpleanos: "",
    esVisible: true,
    nombreOficina: ""
  }
  //Obtenemos el usuario por Su Id
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    usuario = data;
    //Obtenemos todas las litas de oficinas disponibles
    OficinaDAO.obtenerTodasOficinas((data) => {
      let listaOficinas = data
      //Renderisamos la vista
      PuestoDAO.obtenerTodosPuestos((data) => {
        let listaPuestos = data;
        res.render('Contactos/unosolo/verUnContacto', {
          usuario: usuario,
          contacto: contacto,
          listaOficinas: listaOficinas,
          listaPuestos: listaPuestos,
          tipoMensaje: 0,
          agregar: agregar
        });
      });
    });
  });
});



//ruta para acceder al listado de oficinas
router.post('/verListaOficinas', function (req, res, next) {
  //Obtenemos el id del usuario que esta usuado la pagina
  let {
    IdUsuario
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    //Obtenemos el usuario en base a l id capturado
    usuario = data;
    //Mandamos a llamar la lista de contactos 
    OficinaDAO.obtenerTodasOficinas((data) => {
      //Guardamos la lista de contactos en una variable de tipo lista
      listaOficinas = data;
      //Rendierizamos la vista
      res.render('Contactos/listas/listaOficinas', {
        usuario: usuario,
        listaOficinas: listaOficinas
      });
    });
  });
});


//Ruta para ver una oficina
router.post('/verUnaOficina', function (req, res, next) {
  //console.log("Cargando contacto")
  //Obtenemos el id del usuario que esta usando la pagina y del contacto a ver??
  let {
    IdUsuario,
    IdOficina
  } = req.body;

  //mandamos a llamar al usuario
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    //guardamos el usuario en esta variable
    let usuario = data;
    //Mandamos a llamar a la oficina a ver
    OficinaDAO.obtenerOficinaPorId(IdOficina, (data) => {
      let oficina = data;
      //console.log(usuario)
      //console.log(oficina)
      res.render('Contactos/unosolo/verUnaOficina', {
        usuario: usuario,
        oficina: oficina,
        tipoMensaje: 0
      })
    });
  });
});

router.post('/guardarDatosOficna', function (req, res, next) {
  let {
    IdUsuario,
    IdOficina,
    nombreOficina,
    status
  } = req.body;

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    OficinaDAO.guardarDatosOficina(IdOficina, nombreOficina, status, (data) => {
      let IdOficina = data.valor;
      //console.log(IdOficina)
      OficinaDAO.obtenerOficinaPorId(IdOficina, (data) => {
        let oficina = data;
        res.render('Contactos/unosolo/verUnaOficina', {
          usuario: usuario,
          oficina: oficina,
          tipoMensaje: 1
        });
      });

    });
  });
});


//ruta para crear un nuevo contacto
router.post('/nuevaOficina', function (req, res, next) {
  //Obtenemos el Id del usuario que esta usando la pagina
  let {
    IdUsuario,
    agregar
  } = req.body;

  let oficina = {
    IdOficina: 0,
    nombreOficina: "",
    status: true
  }
  //Obtenemos el usuario por Su Id
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    usuario = data;
    //Obtenemos todas las litas de oficinas disponibles
    res.render('Contactos/unosolo/verUnaOficina', {
      usuario: usuario,
      oficina: oficina,
      agregar: agregar,
      tipoMensaje: 0
    });
  });
});


//Ruta para guardar los datos de un puesto
router.post('/guardarDatosPuesto', function (req, res, next) {
  let {
    IdUsuario,
    IdPuesto,
    nombrePuesto,
    status
  } = req.body;

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    PuestoDAO.guardarDatosPuesto(IdPuesto, nombrePuesto, status, (data) => {
      let IdOficina = data.valor;
      //console.log(IdOficina)
      PuestoDAO.obtenerPuestoPorId(IdOficina, (data) => {
        let puesto = data;
        res.render('Contactos/unosolo/verUnPuesto', {
          usuario: usuario,
          puesto: puesto,
          tipoMensaje: 1
        });
      });

    });
  });
});


//ruta para acceder al listado de puestos
router.post('/verListaPuestos', function (req, res, next) {
  //Obtenemos el id del usuario que esta usuado la pagina
  let {
    IdUsuario
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    //Obtenemos el usuario en base a l id capturado
    usuario = data;
    //Mandamos a llamar la lista de contactos 
    PuestoDAO.obtenerTodosPuestos((data) => {
      //Guardamos la lista de contactos en una variable de tipo lista
      listaPuestos = data;
      //Rendierizamos la vista
      res.render('Contactos/listas/listaPuestos', {
        usuario: usuario,
        listaPuestos: listaPuestos
      });
    });
  });
});


//Ruta para ver un puesto
router.post('/verUnPuesto', function (req, res, next) {
  //console.log("Cargando contacto")
  //Obtenemos el id del usuario que esta usando la pagina y del contacto a ver??
  let {
    IdUsuario,
    IdPuesto
  } = req.body;

  //mandamos a llamar al usuario
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    //guardamos el usuario en esta variable
    let usuario = data;
    //Mandamos a llamar a la oficina a ver
    PuestoDAO.obtenerPuestoPorId(IdPuesto, (data) => {
      let puesto = data;
      res.render('Contactos/unosolo/verUnPuesto', {
        usuario: usuario,
        puesto: puesto,
        tipoMensaje: 0
      })
    });
  });
});

//ruta para crear un nuevo puesto
router.post('/nuevoPuesto', function (req, res, next) {
  //Obtenemos el Id del usuario que esta usando la pagina
  let {
    IdUsuario,
    agregar
  } = req.body;

  let puesto = {
    IdPuesto: 0,
    nombrePuesto: "",
    status: true
  }
  //Obtenemos el usuario por Su Id
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    usuario = data;
    //Obtenemos todas las litas de oficinas disponibles
    res.render('Contactos/unosolo/verUnPuesto', {
      usuario: usuario,
      puesto: puesto,
      agregar: agregar,
      tipoMensaje: 0
    });
  });
});




//Parte de correos
router.post('/armarCorreo', function (req, res, next) {
  //console.log("Pss")
  let {
    IdUsuario,
    mail,
    IdContacto,
    origen,
    IdCentroCosto

  } = req.body;

  if (origen == "contacto") {

    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      let tieneCorreo = true;
      if (usuario.mail == "" || usuario.passMail == "") {
        tieneCorreo = false;
        //mandamos a llamar al usuario
        UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
          //guardamos el usuario en esta variable
          let usuario = data;

          //Mandamos a llamar al contacto
          ContactosDAO.obtenerContactoPorId(IdContacto, (data) => {
            //Guardamos al contacto en esta variable
            let contacto = data;
            //Obtenemos todas las litas de oficinas disponibles
            OficinaDAO.obtenerTodasOficinas((data) => {
              let listaOficinas = data
              //Renderisamos la vista
              PuestoDAO.obtenerTodosPuestos((data) => {
                let listaPuestos = data;
                res.render('Contactos/unosolo/verUnContacto', {
                  usuario: usuario,
                  contacto: contacto,
                  listaOficinas: listaOficinas,
                  listaPuestos: listaPuestos,
                  tipoMensaje: 0,
                  tieneCorreo: tieneCorreo,
                });
              });
            });
          });
        });

      } else {

        res.render('correo', {
          usuario: usuario,
          mail: mail,
          tipoMensaje: 0,
          origen: origen,
          IdCentroCosto: IdCentroCosto,
          IdContacto: IdContacto
        });
      }
    });

  }

  if (origen == "centroCosto") {

    propiedadesDAO.getPropiedades((data) => {
      let enCostruccion = data.enCostrusccion;
      //Recuperamos el Id del usuario y del centro de costo para capturar en la pantalla
      let {
        IdCentroCosto,
        IdUsuario
      } = req.body;
      UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
        let usuario = data;
        //console.log(usuario);
        if (usuario.mail == "" || usuario.passMail == "") {
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
                  if (enCostruccion) {
                    res.render('construccion');
                  } else {
                    res.render('administracion/unosolo/verUnCentroCosto', {
                      usuario: usuario,
                      centroCosto: centroCosto,
                      listaEmpresas: listaEmpresas,
                      listaFranquicias: listaFranquicias,
                      listaTipoUnidades: listaTipoUnidades,
                      tipoMensaje: 0,
                      tieneCorreo: false
                    });
                  }
                });
              });
            });
          });
        } else {
          res.render('correo', {
            usuario: usuario,
            mail: mail,
            tipoMensaje: 0,
            origen: origen,
            IdCentroCosto: IdCentroCosto,
            IdContacto: IdContacto
          });
        }
      });
    })






  }


});


//Mandar correo
router.post('/mandarCorreo', function (req, res, next) {
  const smtpTransport = require('nodemailer-smtp-transport');
  const nodemailer = require('nodemailer');

  //console.log("Intentando mandar correo");

  let {
    IdUsuario,
    asunto,
    mensaje,
    destinatario,
    correoDestino

  } = req.body;

  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    let usuario = data;
    //console.log(usuario)
    const transporter = nodemailer.createTransport(smtpTransport({
      host: 'mail.dominosgda.com',
      secureConnection: false,
      tls: {
        rejectUnauthorized: false
      },
      port: 587,
      auth: {
        user: usuario.mail + '@dominosgda.com',
        pass: usuario.passMail,
      }
    }));

    let mailOption = {
      from: usuario.nombreCompleto + " : " + usuario.mail,
      to: destinatario,
      subject: asunto,
      text: mensaje
    }

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        res.render('correo', {
          usuario: usuario,
          mail: correoDestino,
          tipoMensaje: 2
        });
      } else {
        res.render('correo', {
          usuario: usuario,
          mail: correoDestino,
          tipoMensaje: 1
        });
      }
    });
  });


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
  CCDAO.obtenerCentrosCostoPorFranquicia(IdUsuario, IdFranquicia, (data) => {
    let centroCosto = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      //console.log(fecha + ' las ' + hora);
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
      //console.log(fecha + ' las ' + hora);
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
      //console.log(fecha + ' las ' + hora);
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
      //console.log(fecha + ' las ' + hora);
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
      //console.log(fecha + ' las ' + hora);
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


//ruta para generar reporte de contactos
router.post('/reporteContacto', function (req, res, next) {
  //Obtenemos el id del usuario que esta usuado la pagina
  let {
    IdUsuario
  } = req.body;
  UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
    //Obtenemos el usuario en base a l id capturado
    usuario = data;
    //Mandamos a llamar la lista de contactos 
    ContactosDAO.obtenerTodosContactos((data) => {
      //Guardamos la lista de contactos en una variable de tipo lista
      listaContactos = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      //console.log(fecha + ' las ' + hora);
      //Rendierizamos la vista
      res.render('Contactos/reportes/reporteContactos', {
        usuario: usuario,
        listaContactos: listaContactos,
        fecha: fecha,
        hora: hora
      });
    });
  });
});

/*Esta ruta genera el reporte que contiene a todas las oficinas
con su informacion, tambien idica quien elabora el reporte, fecha y hora*/
router.post('/reporteOficinas', function (req, res, next) {
  //capturamos el id del usuario para mostrar en el reporte
  let {
    IdUsuario
  } = req.body;
  //Obtenemos todos todas la franquicias
  OficinaDAO.obtenerTodasOficinas((data) => {
    let listadoFranquicias = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      //console.log(fecha + ' las ' + hora);
      //Renderizamos la vista del report
      res.render('Contactos/reportes/reporteOficinas', {
        listadoFranquicias: listadoFranquicias,
        usuario: usuario,
        fecha: fecha,
        hora: hora
      });
    })
  });
});


/*Esta ruta genera el reporte que contiene a todas los puestos
con su informacion, tambien idica quien elabora el reporte, fecha y hora*/
router.post('/reportePuestos', function (req, res, next) {
  //capturamos el id del usuario para mostrar en el reporte
  let {
    IdUsuario
  } = req.body;
  //Obtenemos todos todas la franquicias
  PuestoDAO.obtenerTodosPuestos((data) => {
    let listaPustos = data;
    //Obtenemos los datos del usuario atraves de su Id
    UsuarioDAO.obtenerUsuarioPorId(IdUsuario, (data) => {
      let usuario = data;
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var fecha = dt.format('Y-m-d');
      var hora = dt.format('H:M:S');
      //console.log(fecha + ' las ' + hora);
      //Renderizamos la vista del report
      res.render('Contactos/reportes/reportePuestos', {
        listaPustos: listaPustos,
        usuario: usuario,
        fecha: fecha,
        hora: hora
      });
    })
  });
});

module.exports = router;