const { model, Schema } = require ('mongoose');



const RolSchema = Schema({

    rol: {
        type: String,
        require: [true, 'El rol es obligatorio']
    }

});



module.exports = model('Role', RolSchema);