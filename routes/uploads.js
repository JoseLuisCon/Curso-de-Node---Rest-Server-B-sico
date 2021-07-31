const { Router } = require ('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen,actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads');
const { validarCampos, validarJWT, validarArchivoSubir } = require('../middlewares');

const { coleccionesPermitidas } = require ('../helpers')

const router = Router();

    router.post('/', [validarJWT,
                      validarArchivoSubir] ,cargarArchivo)


    router.put('/:coleccion/:id', [
        validarJWT,
        validarArchivoSubir,
        check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
        check('id', 'El id debe de ser un Id de mongo').isMongoId(),
        validarCampos
    ], actualizarImagenCloudinary) 
    //actualizarImagen )
    
    router.get ('/:coleccion/:id',[
        validarJWT,
        check('id', 'El id debe de ser un Id de mongo').isMongoId(),
        check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ], mostrarImagen)

module.exports = router;