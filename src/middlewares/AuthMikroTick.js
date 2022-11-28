
const AuthMikroTick = (req, res, next) => {
    const {ip, port, access, id} = req.params 

    req.data = {user: "admin", pass: "", port: port, ip: ""}

    //Si puede aministrar la id solicitada
    if(!req.user.Mikroticks.includes(parseInt(id))){
        return res.json({'mensaje_tipo': 'error', 'mensaje': 'Aceeso denegado'})
    }

    req.data.ip = ip
    req.data.port = port

    if(access==0){

        req.data.user = "admin"
        req.data.pass = "8891957"
        
    }else if(access==1){

        req.data.user = "admin"
        req.data.pass = "admin8891957"

    }else{
        res.json({message: "access denied"})
    }
    
    next()
}

module.exports = AuthMikroTick