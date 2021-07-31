const  generarJWT    = require ('../helpers/generarJWT');
const  googleVerify  = require ('../helpers/google-verify');
const  dbValidators  = require ('../helpers/db-validators');
const  subirArchivo  = require ('../helpers/subir-archivo');



module.exports = {
    ...generarJWT,
    ...googleVerify,
    ...dbValidators,
    ...subirArchivo
}