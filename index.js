const express = require("express")
const parser = require("./utils/CsvParser")
const {UpdateDatabase, DropDatabase} =  require("./database/database")
const {FindStudent, GetStudentsWithFilters} = require("./database/Student")
const {allSpecializations} = require("./database/Specialization")
const {AllCourses} = require("./database/Course")
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

app.post("/students", async (req,res) => {
    await GetStudentsWithFilters(req.body)
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

app.get("/specializations", async (req,res) => {
    await allSpecializations()
    .then(specs => {
        const js = res.json(specs)
        return js
    })
    .catch((err) => {
        console.log(err)
        res.end(err)
    })
})

app.get("/courses", async (req,res) => {
    await AllCourses()
    .then(courses => {
        const js = res.json(courses)
        return js
    })
    .catch((err) => {
        console.log(err)
        res.end(err)
    })
})

app.listen("4200", async () => {
    console.log("App is started!")
    //await UpdateDatabase()
})   