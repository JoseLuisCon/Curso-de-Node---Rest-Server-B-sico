const { response } = require("express");
const { Producto }= require("../models");



const obtenerProductos = async (req, res=response) =>{
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
     
     
    const [total, productos] = await Promise.all ([
         
         Producto.countDocuments (query),
         Producto.find(query)
        .skip( Number( desde ) )
        .limit( Number( limite ) )
        .populate ( 'usuario' , {nombre: 1, _id:0}  )
        .populate ( 'categoria', {nombre: 1, _id:0})
    ])

    res.json({
           total, 
           productos
        })
}
   


// obtenerProducto -  populate  {}

 const obtenerProducto = async (req, res=response ) =>{

        const { id } = req.params;

        const producto = await Producto.findById ( id )      
        .populate ( 'usuario' , {nombre: 1, _id:0}  )
        .populate ( 'categoria', {nombre: 1, _id:0})
    
    res.json( producto )

 }



const crearProducto = async (req, res=response) => {

    const {estado, usuario, ...body} = req.body;
    
    
    const productoDB = await Producto.findOne(  {nombre: body.nombre.toUpperCase()},  {new: true} );
    
    
    if ( productoDB ) {
        return res.status (400).json({
            msg: `El producto ${body.nombre} ya existe en la base de datos`
        });
    }
                                                 

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
     };
    
    const producto = new Producto( data );

    await producto.save();

    res.status(201).json( producto );

}

// actualizarCategoria - solo se modifica el nombre

const actualizarProducto = async (req, res=response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    const productoDB = await Producto.findOne( {nombre: data.nombre} );

    if ( productoDB ) {
        return res.status (400).json({
            msg: `Ya existe el producto: ${productoDB.nombre}`
        });
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate ( id, data, {new: true} )
    
    res.status(200).json( producto )    


}


// borrar Producto - cambiar estado a false

const borrarProducto = async (req, res=response ) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado:false}, {new: true});

    
    res.status(200).json({
        productoBorrado
    })    
}



module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProductos,
    obtenerProducto
}