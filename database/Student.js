const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const {Specialization} = require("./Specialization")
const {Course} = require("./Course")
const {Module} = require("./Module")

const dbUrl = "mongodb://127.0.0.1:27017/"


const StudentSchema = new Schema({
    fullName: {
        type:String,
        unique: true
    },
    group: String,
})

const Student = mongoose.model("Student", StudentSchema);

const FindStudent = async (name) => {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    console.log("getting student with name " + name + "...")
    const studentFromDb = await Student.findOne({ fullName: name }).lean()
    let student = {
        fullName: studentFromDb.fullName,
        group: studentFromDb.group,
        specializations: []
    }
    student.specializations = await Specialization.find({student: student.fullName}).lean()

    student.specializations.map(spec => {
        spec.courses = []
        return spec;
    })
    const courses = await Course.find({student: student.fullName}).lean()
    courses.map(course => {
        course.modules = []
        return course;
    })

    const modules = await Module.find({student: student.fullName}).lean()

    await mongoose.disconnect() 

    for (let i = 0; i < modules.length;i++) {
        let course = courses.find(course => course.courseName === modules[i].courseName)
        let found =  course.modules.find(mod => mod.moduleName === modules[i].moduleName)

        if (found) {
            const index = course.modules.indexOf(found)
            course.modules[index] = modules[i]
        }
        else
            course.modules.push(modules[i])
    }

    for (let i = 0; i < courses.length;i++) {
        let spec = student.specializations.find(spec => spec.university === courses[i].university)
        if (!spec) {
            let crs = student.specializations.find(spec => spec.university === '').courses
            crs.push(courses[i])
        }
        else {
            spec.courses.push(courses[i])
        }
    } 
    return student; 
} 

const AllStudents = async () => {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    const res = await Student.find({}).lean()
    .catch(err => console.log(err))
    await mongoose.disconnect()
    return res.map(student => {
        return {fullName: student.fullName, group: student.group}
    });
}

const AddStudents = async () => {
    let urfu = await parser("membership.csv")
    let students = await Student.find({})
    console.log(students[0])
    console.log("adding students")
    for (let i = 1; i < urfu.length; i++) {
        let student = {
            fullName: urfu[i][0],
            group: urfu[i][2],
        }
        if (!validateFullName(student.fullName)) continue;

        if (!students.includes(std => std.fullName === student.fullName)) {
            students.push(student)
        }
    }
    await Student.insertMany(students)
    .then((st) => console.log("Students added successfully"))
    .catch(err => console.log("error while adding students: " +  err))
    
}

module.exports.Student = Student;
module.exports.FindStudent = FindStudent;
module.exports.AllStudents = AllStudents;
module.exports.AddStudents = AddStudents;