
const express=require('express') // framework of node js to create server
const database=require('./www/db/db') // importing database configure file
const fs=require('fs') // file system module of file read/write

const app=express()

app.use(express.json()) //3rd party middle ware
app.use(express.urlencoded({extended:false}))

const routesPath='./src/routes'  // routes path for configuration of routes

fs.readdirSync(routesPath).forEach(function(file){  // reading routes file for configuration
    if(~file.indexOf('.js'))
    {
        let route=require(routesPath+'/'+file)
        route.setRouter(app) //executing routes file
    }
})

//start the Database
database.startDB(app) // executing database file
