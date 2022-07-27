const router = require('express').Router()

var MikroNode = require('mikronode');

var ipmikro = "194.195.223.242";
var portmikro = "7024";
var usermikro = "admin";
var passmikro = "admin8891957";

router.get('/status/:ip', (req, res) => {
    const {ip} = req.params 
    
    console.log(ip)
    // Create API instance to a host.
    var device = new MikroNode(ipmikro, portmikro);
    // device.setDebug(MikroNode.DEBUG);

    // Connect to MikroTik device
    device.connect().then(([login])=>login(usermikro,passmikro)).then(conn=>{
        
        res.json({"status": 'Activo'})  
            
    }).catch(error=>{
        console.log("Error logging in ",error);

        res.json({"status": 'Inactivo'})
    });

   
})

router.get('/hotspot/host/:ip', (req, res) => {
    const {ip} = req.params

    var device = new MikroNode(ipmikro, portmikro);

    device.connect().then(([login])=>login(usermikro,passmikro)).then(conn=>{
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

router.get('/hotspot/tickethost/', (req, res) => {
   
    var device = new MikroNode(ipmikro, portmikro);

    device.connect().then(([login])=>login(usermikro,passmikro)).then(conn=>{
        conn.closeOnDone(true)

        var channel2 = conn.openChannel("hotspot_active")

        
        channel2.write("/ip/hotspot/active/print")
        channel2.sync(true)
        
        channel2.on('done', function(packet2) {
            
            res.json(MikroNode.resultsToObj(packet2.data))

        })
            

    }).catch(error=>{
        console.log(error)
        res.json({"error": "Sin Conexion"})
    })
})

router.get('/hotspot/machost', (req, res) => {

    var device = new MikroNode(ipmikro, portmikro);

    device.connect().then(([login])=>login(usermikro,passmikro)).then(conn=>{
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

router.get('/hotspot/active/remove/:id', function(req, res){
    const {id} = req.params

    var device = new MikroNode(ipmikro, portmikro);

    device.connect().then(([login])=>login(usermikro,passmikro)).then(conn=>{
        conn.closeOnDone(true)

        var channel2 = conn.openChannel("hotspot_active")

        channel2.write("/ip/hotspot/active/remove", {'numbers': id})
        channel2.sync(true)

        channel2.on('trap',function() {
            
            res.json({"error": "recurso no encontrado"})
        });

        channel2.on('done', function() {
            
            res.json({"success": "desconectado con exito"})
        })
            
       

    }).catch(error=>{
        console.log(error)
        res.json({"error": "Sin Conexion"})
    })
})

router.get('/hotspot/host/remove/:id', function(req, res){
    const {id} = req.params

    var device = new MikroNode(ipmikro, portmikro);

    device.connect().then(([login])=>login(usermikro,passmikro)).then(conn=>{
        conn.closeOnDone(true)

        var channel2 = conn.openChannel("hotspot_host")

        channel2.write("/ip/hotspot/host/remove", {'numbers': id})
        channel2.sync(true)

        channel2.on('trap',function() {
            
            res.json({"error": "recurso no encontrado"})
        });

        channel2.on('done', function() {
            
            res.json({"success": "desconectado con exito"})
        })
            
       

    }).catch(error=>{
        console.log(error)
        res.json({"error": "Sin Conexion"})
    })
})

router.get('/logs', (req, res) => {
    // Create API link to host. No connection yet..
    var device = new MikroNode('192.168.88.223');

    // Debug level is "DEBUG"
    // device.setDebug(MikroNode.DEBUG);

    var removeId=[];
    // Connect to the MikroTik device.
    device.connect()
        .then(([login])=>login(usermikro,passmikro))
        .then(function(conn) {

            console.log("Connected")
        // var channel=conn.openChannel('all_addresses');
        // channel.closeOnDone(true); // only use this channel for one command.
        var listener=conn.openChannel('address_changes');
        listener.closeOnDone(true); // only use this channel for one command.

        // channel.write('/ip/address/print');
        listener.write('/log/listen');
        // channel.write('/ip/firewall/filter/print');

        listener.data.filter(d=>d.data[d.data.length-1].field!=='.dead').subscribe(d=>{
            const data = MikroNode.resultsToObj(d.data.filter(col=>["time","topics","message"].indexOf(col.field)!=-1));
            console.log("Log:",JSON.stringify(data));
        });

        // in 5 seconds, stop listening for address changes.
        setTimeout(function() {
            console.log("Closing out listener");
            listener.write('/cancel'); /* cancel listen */
        },500000);
    }).catch(function(err) {
        console.log("Failed to connect. ",err);
    });

    res.send("finalizado")
})

module.exports = router