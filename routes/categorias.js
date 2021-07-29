const { Router } = require ('express');
const { check } = require('express-validator');


const { existeCategoria } = require ('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole} = require('../middlewares');

const { borrarCategoria,
        crearCategoria, 
        obtenerCategorias,
        obtenerCategoria, 
        actualizarCategoria} = require ('../controllers/categorias');


const router = Router();



// Obtener todas las categorias -publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id -publico
router.get('/:id',
    [    
        check ('id', 'No es un ID válido').isMongoId(),  
        check('id').custom( existeCategoria ),
        validarCampos
     ], obtenerCategoria);


// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos]    
, crearCategoria);

// Actualizar un categoria por id - privado - cualquier persona con un token válido
router.put ('/:id', [ 
    validarJWT, 
    check ('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check ('id', 'No es un ID válido').isMongoId(),  
    check('id').custom( existeCategoria ),
    validarCampos
],  actualizarCategoria);

// Borrar una categoria por id - privado - cualquier persona con un token válido
// - solo para usuario con rol ADMIN_ROLE

router.delete ('/:id', [
   validarJWT,
   esAdminRole, 
   check ('id', 'No es un ID válido').isMongoId(),
   check ('id').custom( existeCategoria ),
   validarCampos
], borrarCategoria);


module.exports = router;