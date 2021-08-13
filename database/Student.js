const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const  { SpecializationSchema } = require("./Specialization")

const dbUrl = "mongodb://127.0.0.1:27017/"

const StudentSchema = new Schema({
    fullName: {
        type:String,
        unique: true
    },
    group: String,
    specializations: [SpecializationSchema]
})

const Student = mongoose.model("Student", StudentSchema);

const FindStudent = async (name) => {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

    const res = await Student.findOne({ fullName: name })
    mongoose.disconnect()
    return res;
}

const AllStudents = async () => {
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    const res = await Student.find({})
    .exec()
    .catch(err => console.log(err))

    await mongoose.disconnect()
    return res;
}

const AddStudents = async () => {
    let urfu = await parser("membership.csv")
    let students = await Student.find({})
    console.log("adding students")
    for (let i = 1; i < urfu.length; i++) {
        let student = {
            fullName: urfu[i][0],
            group: urfu[i][2],
            specializations: []
        }
        if (!validateFullName(student.fullName)) continue;

        if (!students.filter(std => std.fullName === student.fullName).length === 0) {
            students.push(student)
        }
    }
    await Student.insertMany(students)
    .then((students) => console.log("Students added successfully"))
    .catch(err => console.log("error while adding students: " + err))
    
} 

module.exports.Student = Student;
module.exports.FindStudent = FindStudent;
module.exports.AllStudents = AllStudents;
module.exports.AddStudents = AddStudents; 