const { response, request } = require('express');
const jwt = require ('jsonwebtoken');

const Usuario = require ('../models/usuario');


const validarJWT = async (req=request, res=response, next ) => {

    const token = req.header('x-token');
    
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }


    try {
        
        //Extraemos el uid del usuario que habíamso guardado en el token
        const { uid } = jwt.verify (token, process.env.SECRETORPRIVATEKEY);

        //Buscamos en la base de datos el usuario con el uid
        const usuario = await Usuario.findById ( uid );

        if (!usuario ) {

            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en la base de datos'
            })

        }
        
        //Verificar si el uid tiene el estado en true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado false'
            })
        }
        
        req.usuario  = usuario; 

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })

    }

}


module.exports = {
    validarJWT
}