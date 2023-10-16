const User = require('./models/User')
const Role = require('./models/Role')   //importar modelo
const bcrypt = require('bcrypt');       //importar bcrypt
const jwt = require('jsonwebtoken');
const {secret} = require('./config')      //importar secret

//funccion crea un token y lo coloca dentro de id de usuario y su role
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})    //tiempo de vida 24 horas
} 

//por comodidad es mejor utilizar las clases
class authController {

    // función de registro
    async registration(req, res) {
        try {
            //datos del cuerpo de la solicitud
            const {username, password } = req.body;
            //buscar el usuario en la base de datos. User es nodbre del model. FindOne es un metodo de buscar
            const candidate = await User.findOne( { username } ); 
            //si se encuentra devuelve un mensaje
            if (candidate) {        
                return res.status(400).json({message: `User with ${username} already exists`});
            }
            //cifrar la contraseña
            const hashPassword = bcrypt.hashSync(password, 7); 
            //buscar un rol basado en el modelo. siempre se crea sólo USER
            const userRole = await Role.findOne({value: "USER"})    
            //crear objeto user con datos
            const user = new User({username, password: hashPassword, roles: [userRole.value]})  
            //guardar en base de datos
            await user.save()   
            return res.json({message: `User ${username} has been successfully registered`})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', error: e.message })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body   //datos del cuerpo de la solicitud
            //buscar el usuario en la base de datos
            const user = await User.findOne({username})
            //si no se encuentra, el objeto estará vacío y seguirá la siguiente condición
            if (!user) {
                return res.status(404).json({message: `User with ${username} not found`})
            }
            //descifrar la contraseña del cliente utilizando compareSync
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(401).json({message: `Incorrect password entered`})
            }
            //generar un token y enviarlo al cliente
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
   
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'getUsers error'})
        }
    }
}

module.exports = new authController()
