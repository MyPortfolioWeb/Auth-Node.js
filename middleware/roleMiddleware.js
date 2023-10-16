const jwt = require('jsonwebtoken');
const {secret} = require('../config')
module.exports = function (roles) {             //tomamos un array de roles!!!
    return function (req, res, next) {
        if (req.method === "OPTIONS") {     //excluir el método de consulta OPTIONS
            next()
        }
        try {
            //extraer el token de las cabeceras, dividir la cadena en dos partes y tomar la segunda parte. [1]
            const token = req.headers.authorization.split(' ')[1]
                if (!token) {       //si no tenemos token  
                return res.status(403).json({message: "Usuario no autorizado"})
            }
            const {roles: userRoles} = jwt.verify(token, secret)    //cambiar el nombre a userRoles
            let hasRole = false     //por defecto
            userRoles.forEach(role => {     //comprobar si los roles permitidos para esta función están en la lista de roles
                if (roles.includes(role))   //si el array roles contiene un rol que el usuario tiene
                hasRole = true      //entonces lo cambiamos a true.
            });
            if (!hasRole) {         //si la función no está autorizada volver al cliente
                return res.status(403).json({message: "No tienes acceso"})
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({message: "Usuario no autorizado"})
        }
    }
}