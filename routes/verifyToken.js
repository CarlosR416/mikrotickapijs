//Jsonwebtoken
const jwt = require("jsonwebtoken")


// valida el token y brinda acceso a rutas protegidas
const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token
    
    if (!token) return res.status(401).send('Acceso denegado')
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next() // continuamos
    } catch (error) {
        res.status(400).send('token no es válido')
    }
}

module.exports = verifyToken;