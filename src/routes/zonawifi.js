const router = require('express').Router()

var MikroNode = require('mikronode');

router.get('/status', function(req, res){

    const {ip, port, user, pass} = req.data


    // Create API instance to a host.
    var device = new MikroNode(ip, port);
    // device.setDebug(MikroNode.DEBUG);

    // Connect to MikroTik device
    device.connect().then(([login])=>login(user,pass)).then(conn=>{
        
        res.json({"status": 'Activo'})  
            
    }).catch(error=>{
        console.log("Error logging in ",error);

        res.json({"status": 'Inactivo'})
    });
       
})


router.get('/hotspot/conectados', (req, res) => {
    
    const IpAccess = req.data.ip
    const usermikro = req.data.user
    const password = req.data.pass
    const port = req.data.port

    var device = new MikroNode(IpAccess, port);

    device.connect().then(([login])=>login(usermikro,password)).then(conn=>{
        conn.closeOnDone(true)

        var channel = conn.openChannel("hotspot_host")
        var channel2 = conn.openChannel("hotspot_active")

        channel.write("/ip/hotspot/host/print")
        channel.sync(true)

        channel.on('done', function(packet) {
            /*packet.data.forEach(element => {
                var packets=MikroNode.resultsToObj(element);
                console.log('Host: '+JSON.stringify(packet));
            })*/
            channel2.write("/ip/hotspot/active/print")
            channel2.sync(true)
            var merge = MikroNode.resultsToObj(packet.data)
            channel2.on('done', function(packet2) {
                
                res.json(merge.concat(MikroNode.resultsToObj(packet2.data)))
            })
            
        })

    }).catch(error=>{
        console.log(error)
        res.json({"error": "Sin Conexion"})
    })
})


router.get('/hotspot/machost', function(req, res){

    const {ip, port, user, pass} = req.data

    var device = new MikroNode(ip, port);

    device.connect().then(([login])=>login(user,pass)).then(conn=>{
        conn.closeOnDone(true)

        var channel = conn.openChannel("hotspot_host")

        channel.write("/ip/hotspot/host/print")
        channel.sync(true)

        channel.on('done', function(packet) {
            
            res.json(MikroNode.resultsToObj(packet.data))
            
        })

    }).catch(error=>{
        console.log(error)
        res.json({"error": "Sin Conexion"})
    })
})


module.exports = router