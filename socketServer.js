const http = require('http')
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require("cors");
const IdMap = require('./Utils/ConnectedUsers/connectedConsumers');

const TestRouter = require('./Routes/TestingRoute')
const UserRouter = require("./Routes/UserRoutes");
const AnalysisRouter = require('./Routes/analysisRoute')
const ServiceProviderRouter = require('./Routes/ServiceProviderRoute');

const PORT = 8000;
const IP = '192.168.1.2';
const app = express();
const Server = http.createServer(app);

////Socket Init... !DO NOT CHANGE!...
const io = socketIo(Server, {
    cors: '*'
});
module.exports = io;
require('./Utils/SocketIoEvents/socketEvents')();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());



mongoose.connect("mongodb+srv://Peter:TZ8eXrltEYMuVdQb@cluster0.f1z37qq.mongodb.net/Graduation_Project")
    .then(() => {
        Server.listen(PORT, IP, () => {

            app.get("/", (req, res) => {
                res.send("hello to server")
            })

            app.use("/api/user", UserRouter);

            app.use('/api/serviceProvider', ServiceProviderRouter);

            app.use('/api/analysis',AnalysisRouter)
            ///TESTING ROUTE
            app.use('/api/test', TestRouter);


            console.log("listening on port http://localhost:" + PORT);
        })
    })
    .catch((e) => {
        console.log(e);
    })
