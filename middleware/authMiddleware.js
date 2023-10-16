const jwt = require('jsonwebtoken');
const {secret} = require('../config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        //extraer el token de las cabeceras, dividir la cadena en dos partes y tomar la segunda parte. [1]
        const token = req.headers.authorization.split(' ')[1]
            if (!token) {       //si no hay token
            return res.status(403).json({message: "Usuario no autorizado"})
        }
        const decodedData = jwt.verify(token, secret)   //aquí está el objeto payload (id, roles) de usuario
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "Usuario no autorizado"})
    }
}