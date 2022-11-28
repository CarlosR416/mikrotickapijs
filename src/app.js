require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const server = require("http").Server(app)
const io = require("socket.io")(server, {
    origins: ["http://localhost"]
  })

//cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//jsonwebtoken
const jwt = require('jsonwebtoken')

const verifyToken = require('./middlewares/verifyToken')

const MikrotickRoutes = require('./routes/mikrotiks')
const AuthMikroTick = require('./middlewares/AuthMikroTick') 
const ZonawifiRouters = require('./routes/zonawifi')

io.on("connection", function (socket) {

    
    async function getAllUsersfromDB(){
        
        var MikroNode = require('mikronode')
        // Create API link to host. No connection yet..
        var device = new MikroNode('192.168.88.223');

        // Debug level is "DEBUG"
        // device.setDebug(MikroNode.DEBUG);

        var removeId=[];
        // Connect to the MikroTik device.
        device.connect()
            .then(([login])=>login('admin','8891957'))
            .then(function(conn) {

                console.log("Connected")
            
            // var channel=conn.openChannel('all_addresses');
            // channel.closeOnDone(true); // only use this channel for one command.
            var listener=conn.openChannel('address_changes');
            listener.closeOnDone(true); // only use this channel for one command.

            // channel.write('/ip/address/print');
            listener.write('/ip/hotspot/active/print');
            // channel.write('/ip/firewall/filter/print');

            listener.data.subscribe(d=>{
                const data = MikroNode.resultsToObj(d);
                console.log("Log:", data);
                socket.emit("logs", JSON.stringify(data));
            });

            // in 5 seconds, stop listening for address changes.
            setTimeout(function() {
                console.log("Closing out listener");
                listener.write('/cancel'); /* cancel listen */
            },500000);

        }).catch(function(err) {
            console.log("Failed to connect. ",err);
        });
        
    }
   
    
    getAllUsersfromDB();
    
})

app.use(cors())

app.use("/zonawifi/:id/:access/:ip/:port", verifyToken, AuthMikroTick, ZonawifiRouters)

app.get('/', function(req, res){
    res.send("Server Active")
})

module.exports = server