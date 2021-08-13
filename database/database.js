const mongoose = require("mongoose")
const { Student, AddStudents } = require("./Student")
const {Specialization, AddSpecializations} = require("./Specialization.js")
const {Module, AddModules} = require("./Module.js")
const { Course, AddCourses } = require("./Course.js")

const dbUrl = "mongodb://127.0.0.1:27017/"

const UpdateDatabase = async () => {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    
    //await AddStudents()
    //await AddSpecializations()
    //await AddCourses()
    await AddModules()
    await mongoose.connection.close()
        .then(() => console.log("connection is closed"))
        .catch(err => console.log(err))
}

const drop = async (model) => {
    if (model.collection) {
        await model.collection.drop()
    }
}

module.exports.UpdateDatabase = UpdateDatabase;