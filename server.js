const express = require('express');
const path = require("path");

const app = express();

// Sirve archivos estáticos desde la carpeta "public"
    app.use(express.static(path.join(__dirname, 'public')));

//endpoint --forma de acceder al sv
    app.get('/', (req,res) =>{
        res.sendFile(__dirname+"/public/views/index.html")

    });

//routing
app.use('/src', express.static(__dirname+"/src"));
app.use('/public',express.static(__dirname+"/public"));
app.use('/node_modules',express.static(__dirname+"node_modules"))
//listening 
    app.listen(5000, () =>{
        console.log("Servidor corriendo");

    });