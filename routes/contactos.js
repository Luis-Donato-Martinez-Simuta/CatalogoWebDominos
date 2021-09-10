var express = require('express');
var router = express.Router();
let ContactosDAO = require('../models/ContactosDAO');
let UsuarioDAO = require('../models/UsuariosDAO');

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send("Hola desde el archivo contactos");
});

module.exports = router;
