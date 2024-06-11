const express = require('express');
const mongoose = require('mongoose');

const UserRouter = require("./Routes/UserRoutes");
const ServiceProviderRouter = require('./Routes/ServiceProviderRoute');

const PORT = 8000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb+srv://Peter:TZ8eXrltEYMuVdQb@cluster0.f1z37qq.mongodb.net/Graduation_Project")
    .then(() => {
        app.listen(PORT, () => {
            
            app.get("/", (req, res) => {
                res.send("hello to server")
            })

            app.use("/api/user", UserRouter);

            app.use('/api/serviceProvider', ServiceProviderRouter);

            console.log("listening on port http://localhost:" + PORT);
        })
    })
    .catch((e) => {
        console.log(e);
    })