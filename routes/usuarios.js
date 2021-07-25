const { Router } = require ('express');
const { check } = require('express-validator');

const { 
        validarJWT,
        validarCampos,
        tieneRole,
        esAdminRole
    
    } = require ('../middlewares');

const { esRolValido, emailExiste, usuarioExistePorId } = require('../helpers/db-validators');

const { usuariosGet, 
    usuariosPut, 
    usuariosPost,
    usuariosDelete, 
    usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet) 

router.put('/:id', [

   check ('id', 'No es un ID válido').isMongoId(),
   check ('id').custom ( usuarioExistePorId ),
   check( 'rol' ).custom ( esRolValido ),
   validarCampos
], usuariosPut) 

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener más de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    //el rol lo validamos contra la DB con un middlewere personalizado
    check( 'rol' ).custom ( esRolValido ),
    // check('rol', 'No es un rol permitodo').isIn( ['ADMIN_ROLE', 'USER_ROLE']),
    
    validarCampos

    
], usuariosPost) 

router.delete('/:id',[
   validarJWT,
//    esAdminRole,  -----Con este Middlewere sirve para solo autorizar un rol, en este caso el rol de ADMIN_ROLE
   tieneRole('ADMIN_ROLE','VENTAS_ROLE'), 
   check ('id', 'No es un ID válido').isMongoId(),
   check ('id').custom ( usuarioExistePorId ),
   validarCampos
] , usuariosDelete) 

router.patch('/', usuariosPatch) 






module.exports = router;