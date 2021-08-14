const express = require("express")
const parser = require("./utils/CsvParser")
const {UpdateDatabase, DropDatabase} =  require("./database/database")
const {FindStudent, AllStudents} = require("./database/Student")
const cors = require('cors');

const app = express()

app.use(cors());
app.options('*', cors());

app.use(express.json())

app.get("/",(req,res) => {

})

app.post("/student",async (req,res) => {
    let student = await FindStudent(req.body.name)
    //console.log(student)
    res.send(student)  
})

app.get("/database/drop", async (req,res) => {
    await DropDatabase();
    console.log("dropped")
    res.end("dropped")
})

app.get("/students", async (req,res) => {
    await AllStudents()
    .then(students => res.json(students))
    .catch((err) => {
        console.log(err)
        res.end(err)
    })
})

app.get("/database/update", async (req,res) => {
    await UpdateDatabase()
    .then(() => res.end("successfully updated"))
    .catch(err => res.end("updating went wrong " + err))
    
})

app.listen("4200", async () => {
    console.log("App is started!")
    //await UpdateDatabase()
})   