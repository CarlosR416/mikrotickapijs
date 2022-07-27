const router = require('express').Router()
const res = require('express/lib/response')
var MikroNode = require('mikronode');


router.get('/status/:ip', (req, res) => {
    const {ip} = req.params 
    
    console.log(ip)
    // Create API instance to a host.
    var device = new MikroNode(ip);
    // device.setDebug(MikroNode.DEBUG);

    // Connect to MikroTik device
    device.connect().then(([login])=>login('admin','8891957')).then(conn=>{
        
        res.send('Activo')  
            
    }).catch(error=>{
        console.log("Error logging in ",error);

        res.send('Inactivo')
    });

   
})

module.exports = router