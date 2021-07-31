const { Query } = require ('mongoose');
const { Usuario, Role, Categoria, Producto } = require('../models');


const esRolValido = async (rol='') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrada en la base de datos`);
    }
    return true;
}

const emailExiste = async (correo= '') => {
    
    const existeEmail= await Usuario.findOne ({ correo });
    
    if ( existeEmail ) {
        
        throw new Error(`El correo ${ correo } ya existe en la base de datos`);
    }
    
    return true;
    
}

const usuarioExistePorId = async ( id = '') => {
    
    const existeUsuario = await Usuario.findById (id);
    
    if ( !existeUsuario ) {
        throw new Error(`El usuario con Id: ${ id } no está en la base de datos`);
    }
    
    return true;

}

const existeCategoria = async (  id = '' ) => {

    
    const  existeCategoria = await Categoria.findById ( id );

    if ( !existeCategoria ) {

        throw new Error (`La categoria con Id: ${ id } no existe en la base de datos`);
    }
    return true;

}
const existeProductoPorId = async (  id = '' ) => {

    const  existeProducto  = await Producto.findById ( id );

    if ( !existeProducto ) {

        throw new Error (`La producto con Id: ${ id } no existe en la base de datos`);
    }

    return true;
}

/* 
    Validar colecciones permitidas 
*/

const coleccionesPermitidas = async ( coleccion ='', coleccPermitida = [])=>{

    const incluida = coleccPermitida.includes(coleccion);

    if ( !incluida ){
        
       throw new Error (`La coleccin ${coleccion} no es permitida, ${ coleccPermitida }`)
    }
    return true;
}









module.exports = {
    esRolValido,
    emailExiste,
    existeCategoria,
    usuarioExistePorId,
    existeProductoPorId,
    coleccionesPermitidas
};