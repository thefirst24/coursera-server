const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")

const dbUrl = "mongodb://127.0.0.1:27017/"


const StudentSchema = new Schema({
    fullName: {
        type:String,
        unique: true
    },
    group: String,
    specializations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialization'
    }]
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
    .populate("specializations")
    .populate("courses")
    .exec()
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
    .populate({
        path: "specializations",
        populate: {
            path: "courses",
            model: "Course",
            populate: {
                path: "modules",
                model: "Module"
            }
        }
    })
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

        if (!students.find(std => std.fullName === student.fullName)) {
            students.push(student)
        }
    }
    await Student.insertMany(students)
    console.log("Students added successfully")

}

module.exports.Student = Student;
module.exports.FindStudent = FindStudent;
module.exports.AllStudents = AllStudents;
module.exports.AddStudents = AddStudents;