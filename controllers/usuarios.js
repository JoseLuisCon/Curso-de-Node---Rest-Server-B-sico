const { response, request } = require ('express');
const bcryptjs = require ('bcryptjs');

const Usuario = require('../models/usuario');
const { emailExiste } = require('../helpers/db-validators');




// Método Get = listado de registros-documentos
const usuariosGet = async (req = request, res = response) => {
        
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true}

  
    const [total, usuarios] = await Promise.all ([
         
         Usuario.countDocuments ( query ),
         Usuario.find(query)
        .skip( Number( desde ) )
        .limit( Number( limite ) )
    ])

    res.json({
           total, 
           usuarios
        })
      }


// Método Put = modificación de un registro identificado por Id
const usuariosPut = async (req, res = response) => {
        
    const { id } = req.params;
    const { _id, password, google, ...resto} = req.body;

    //TODO validar contra base de datos

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync ( 10 );
        resto.password = bcryptjs.hashSync ( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario)
    }
    

// Método Post = creación nuevo registro
const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol} = req.body;
    
    const usuario = new Usuario( { nombre, correo, password, rol} );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync ( 10 );

    usuario.password = bcryptjs.hashSync ( password, salt );
    
    // Guardar en BD
    await usuario.save();

        res.json({
            usuario           
        })
    }
    
const usuariosDelete= async (req, res = response) => {
    
    const { id } = req.params;

    // //Borrado físico de la base de datos.
    // const usuario = await Usuario.findByIdAndDelete ( id );
 
    // Borrado cambiando el estado del usuario a false
    const usuario = await Usuario.findByIdAndUpdate ( id, {estado:false});

    res.json(usuario )
        usuario
    }

const usuariosPatch= (req, res = response) => {
        res.json({
            msg: 'patch API - controlador'
        })
    } 
    


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}