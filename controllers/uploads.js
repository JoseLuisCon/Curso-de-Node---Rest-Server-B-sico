const path = require ('path');
const fs = require ('fs')

const {response} = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto} = require ('../models')



const cargarArchivo = async (req, res=response)=>{
   
 
  try {
     
    const nombre = await subirArchivo(req.files,undefined, 'imagenes');
    res.json({ nombre })

  } catch ( msg ) {
    res.status(400).json({ msg })  
  }
  
}

const actualizarImagen = async (req, res=response) => {
    
    const { id, coleccion } = req.params; 
        
    let modelo;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById ( id );
            if ( !modelo ) {
                return res.status(400).json({ 
                    msg: `No se encuentra el usuario con Id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById ( id );
            if ( !modelo ) {
                return res.status(400).json({ 
                    msg: `No existe un producto con Id ${id}`
                })
            }

            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    //limpiar imágenes previas
    //Si hay una imagen ya establecida
    if ( modelo.img ) {
        //borramos la imagen del servidor
        const pathImagen = path.join (__dirname, '../uploads',coleccion, modelo.img);
        //Comprobamos que la ruta al fichero existe
        if (fs.existsSync(pathImagen)){
            //borra el archivo del directorio
            fs.unlinkSync(pathImagen);
        }

    }

    
    const nombre = await subirArchivo( req.files, undefined, coleccion );
    
    modelo.img = nombre;

    modelo.save();

    res.status(200).json( modelo )

}

const actualizarImagenCloudinary = async (req, res=response) => {
    
    const { id, coleccion } = req.params; 
        
    let modelo;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById ( id );
            if ( !modelo ) {
                return res.status(400).json({ 
                    msg: `No se encuentra el usuario con Id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById ( id );
            if ( !modelo ) {
                return res.status(400).json({ 
                    msg: `No existe un producto con Id ${id}`
                })
            }

            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    //limpiar imágenes previas
    //Si hay una imagen ya establecida
    if ( modelo.img ) {
        
        // Obetenemos el public_id para eleminar la foto subida desde el path almacenado en 
        // la BD de cloudinary cortando por carpetas '/' y despues desestructurando "ruwmgqpsexg2scbuxcef.jpg"
       const nombreArr= modelo.img.split('/');
       const nombre   = nombreArr[nombreArr.length - 1];
       const [ public_id ] = nombre.split('.');
     
       // Destroy borra la imagen con el id_publico 
       cloudinary.uploader.destroy ( public_id );

    }

    // Estraemos el archivo del directorio temporal del req.files
    const  { tempFilePath } = req.files.archivo;
    // lo cargamos en cloudinary y recojemos el url dentro de cloudinary
      
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
    
    // guardarmos en la propiedad img el url de cloudinary
    modelo.img = secure_url;
    // guardamos en la BD
    await modelo.save();

    res.json(modelo);



}

const mostrarImagen = async (req, res=response) =>{

    const { id, coleccion } = req.params;
    // Imagen por defecto
    const placeHolderImagen = path.join (__dirname, '../assets/no-image.jpg');
    
    
    let modelo;

    switch ( coleccion ) {

        case 'usuarios':
            modelo = await Usuario.findById ( id );
            if ( !modelo ) {
                return res.status(400).json({ 
                    msg: `No se encuentra el usuario con Id ${id}`
                })
            }

            break;
        case 'productos':
            modelo = await Producto.findById ( id );
            if ( !modelo ) {
                return res.status(400).json({ 
                    msg: `No existe un producto con Id ${id}`
                })
            }

            break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    //Si hay una imagen ya establecida
    if ( modelo.img ) {
        
        //construimos el path de la ubicación del archivo en el fs
        const pathImagen = path.join (__dirname, '../uploads',coleccion, modelo.img);
        
        //Comprobamos que la ruta al fichero existe
        if (fs.existsSync(pathImagen)){
            // Devolvemos la imagen como archivo.
            return res.sendFile( pathImagen );
        }
    } 
    
    // Devolvemos la imagen por defecto
    res.sendFile( placeHolderImagen);
    

}


module.exports = {
    actualizarImagen,
    cargarArchivo,
    mostrarImagen,
    actualizarImagenCloudinary
}