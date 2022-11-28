require('dotenv').config()

const express = require('express')
const app = express()


const port = process.env.SERVER_PORT

//cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//jsonwebtoken
const jwt = require('jsonwebtoken')

//cifrado de contraseña
bcrypt = require("bcrypt")
//validaciones
const  {check, validationResult}  = require('express-validator');

//rutas
const Routes = require('./routes/Routes')

const verifyToken = require('./middlewares/verifyToken')
//const { resolve } = require('path')
//const { rejects } = require('assert')


app.listen(port, function(){
    console.log('Servidor Activo ' + port)

})
app.get('/', function(req,  res){
    
    res.send('Hola... Inicio')
})
app.get('/Mikrotick/:ip', function(req,  res){
    
})

app.get("/auth", /*[
        check('usuario')
        .not()
        .isEmpty()
        .isLength({min: 5})
        .withMessage('El usuario es incorrecto'),
        check("password")
        .not()
        .isEmpty()
        .isLength({min: 6})
        .withMessage('La contraseña es incorrecta')
    ],*/ function(request, response){

    //var error = validationResult(request).array()

    /*if(error.length > 0){
        console.log(error)
        return response.render("pages/login", {errors: error})
    }*/

    //const {usuario, password} = request.body
    let token = 0

    /*let sql = `SELECT
                    *
                FROM
                    usuarios
                WHERE usuario = "${usuario}"`*/

    /*conexion_db.query(sql, function(err, data, fields){
        if(err){ 
            //pool.end()
            response.render("pages/login", {errors: [{msg: "Error de conexion con la base de datos"}]})
            //response.redirect(303, "/admin/dashboard")
        }else{
            
            if(typeof(data[0]) != "undefined"){
                
                bcrypt.compare(password, data[0].password, function(err, result){
                    if(err) throw err

                    if(result){

                        // crear token
                        token = jwt.sign({
                            name: data[0].usuario,
                            id: data[0].id,
                            nivel: data[0].nivel
                        }, process.env.TOKEN_SECRET, {expiresIn: "24h"})

                        response.cookie('auth_token', token, {expire : new Date() + 3600}).redirect(303, "/admin/dashboard");
                    }else{
                        response.render("pages/login", {errors: [{msg: "Contraseña incorrecta"}]})
                    }
                    
            
                })

            
            }else{
                
                response.render("pages/login", {errors: [{msg: "El usuario es incorrecto"}]})

            } 
            
        }
    })*/


    // crear token
    token = jwt.sign({
        name: 'Mikrotick',
        id: '02',
        nivel: '0'
    }, process.env.TOKEN_SECRET, {expiresIn: "24h"})

    response.cookie('auth_token', token, {expire : new Date() + 3600}).send(`Token: ${token}`);
})

//Acceso a la APi
app.use('/api', verifyToken, Routes);

// manejador de error 404
app.use((req,res,next) => {
    res.status(404).send("page not fount")
    next()
})