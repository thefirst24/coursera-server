const mongoose = require("mongoose")
const { Student, AddStudents } = require("./Student")
const {Specialization, AddSpecializations} = require("./Specialization.js")
const {Module, AddModules} = require("./Module.js")
const { Course, AddCourses } = require("./Course.js")

const dbUrl = "mongodb://127.0.0.1:27017/"

const UpdateDatabase = async () => {
    
    await DropDatabase()

    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

    await AddStudents()
    await AddSpecializations()
    await AddCourses()
    await AddModules()
    
    await mongoose.connection.close()
        .then(() => console.log("connection is closed"))
        .catch(err => console.log(err))
}

const DropDatabase = async () => {
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    await Student.collection.drop().then(() => console.log("collection Students is droped")).catch(() => console.log("collection Students doesn't exists"))
    await Specialization.collection.drop().then(() => console.log("collection Specializations is droped")).catch(() => console.log("collection Specializations doesn't exists"))
    await Module.collection.drop().then(() => console.log("collection Modules is droped")).catch(() => console.log("collection Modules doesn't exists"))
    await Course.collection.drop().then(() => console.log("collection Courses is droped")).catch(() => console.log("collection Courses doesn't exists"))

    await mongoose.connection.close()
        .then(() => console.log("connection is closed"))
        .catch(err => console.log(err))
}

module.exports.UpdateDatabase = UpdateDatabase;
module.exports.DropDatabase = DropDatabase;