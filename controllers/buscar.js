const { response } = require ('express');
const { ObjectId } = require ('mongoose').Types

const {Usuario, Categoria, Producto} = require ('../models');

const coleccionesPermitidas = [
    'categoria',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios = async (termino='', res=response)=>{
    
    const isMongoId = ObjectId.isValid( termino );

    if ( isMongoId ){
        
        const usuario = await Usuario.findById ( termino )
        
        return res.json({
            results: (usuario)? [usuario] : []
        })
    }
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find ({ 
        $or: [{nombre: regex},{correo: regex}],
        $and: [{ estado: true}]
     })
    res.json({
        results: usuarios
    })

}

const buscarCategorias = async (termino='', res=response)=>{
    
    const isMongoId = ObjectId.isValid( termino );
    
    if ( isMongoId ){
        
        const categoria = await Categoria.findById ( termino )
        
        return res.json({
            results: (categoria)? [categoria] : []
        })
    }
    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find ({ 
        $and: [{nombre: regex},{estado: true}],
     })
    res.json({
        results: categoria
    })

}
const buscarProductos = async (termino='', res=response)=>{
    
    const isMongoId = ObjectId.isValid( termino );
    
    if ( isMongoId ){
        
        const producto = await Producto.findById ( termino )
                .populate ('categoria', 'nombre')
                
                return res.json({
                    results: (producto)? [producto] : []
                })
            }
            
            const regex = new RegExp(termino, 'i');
            
            const producto = await Producto.find ({ 
                $or: [{nombre: regex},{descripcion: regex}],
                $and: [{ estado: true}]
            })
            .populate ('categoria', {nombre:1 , _id:0})
    res.json({
        results: producto
    })
    
}
    


const buscar = async (req, res=response) => {

    const {coleccion, termino} = req.params;

    if ( !coleccionesPermitidas.includes( coleccion )){
            return res.status(400).json({
                msg: `Las colecciones permitadas son: ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){

        case 'categoria':
            buscarCategorias (termino, res)
            break;
        case 'productos':
            buscarProductos (termino, res)
            break;
        case 'usuarios':

            buscarUsuarios (termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
    }

   

}


module.exports = {
    buscar
}