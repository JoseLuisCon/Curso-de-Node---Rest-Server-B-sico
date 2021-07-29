const { Router } = require ('express');
const { check } = require('express-validator');

const { existeCategoria, existeProductoPorId } = require ('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole} = require('../middlewares');

const { actualizarProducto,
        crearProducto,
        obtenerProductos,
        obtenerProducto,
        borrarProducto

    } = require ('../controllers/productos');

const router = Router();



// // Obtener todos los productos -publico
router.get('/', obtenerProductos);

// Obtener un producto por id -publico
router.get('/:id',
    [    
        check ('id', 'No es un ID válido').isMongoId(),  
        check('id').custom( existeProductoPorId),
        validarCampos
    ], obtenerProducto);
    
    
// Crear producto - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

// Actualizar un producto por id - privado - cualquier persona con un token válido
router.put ('/:id', [ 
    validarJWT, 
    check ('id', 'No es un ID válido').isMongoId(),  
    check('id').custom( existeProductoPorId ),
    
    validarCampos
],  actualizarProducto);

// Borrar una categoria por id - privado - cualquier persona con un token válido
// - solo para usuario con rol ADMIN_ROLE

router.delete ('/:id', [
   validarJWT,
   esAdminRole, 
   check ('id', 'No es un ID válido').isMongoId(),
   check ('id').custom( existeProductoPorId ),
   validarCampos
], borrarProducto);


module.exports = router;