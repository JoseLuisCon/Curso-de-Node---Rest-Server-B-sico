const { response, request } = require ('express');



const usuariosGet = (req = request, res = response) => {
        
    const {q, nombre = 'No name', apikey} = req.query;
    
    res.json({
            msg: 'get API - controlador',
            q,
            nombre,
            apikey
        })
      }

const usuariosPut = (req, res = response) => {
        
    const id = req.params.id;
        res.json({
            msg: 'get PUT - controlador',
            id
        })
    }
    
const usuariosPost = (req, res = response) => {
        
    const {nombre, edad} = req.body;

        res.status(201).json({
            msg: 'POST api',
            nombre,
            edad             
        })
    }
    
const usuariosDelete= (req, res = response) => {
        res.json({
            msg: 'get DELETE - controlador'
        })
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