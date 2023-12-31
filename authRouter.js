const Router = require('express')
const router = new Router()
const controller = require('./authController')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', controller.registration) //llamamos funccion de authController
router.post('/login', controller.login)

router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)
// router.get('/users', authMiddleware, controller.getUsers)


module.exports = router
