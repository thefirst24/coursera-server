const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")

const dbUrl = "mongodb://127.0.0.1:27017/"

const CourseSchema = new Schema({
    student: String,
    courseName: String,
    progress: Number,
    isCompleted: Boolean,
    grade: Number,
    sertificateUrl: String,
    learningHours: Number,
    university: String,
    enrollmentTime: Date,
    classStartTime: Date,
    classEndTime: Date,
    lastCourseActivityTime: Date,
    completionTime: Date,
})

const Course = mongoose.model("Course", CourseSchema);

const CreateCourse = (csvRow) => {
    return {
        student: csvRow[0],
        courseName: csvRow[3],
        progress: Math.floor(csvRow[11]),
        isCompleted: csvRow[13] === "Yes",
        grade: Math.floor(csvRow[19]),
        sertificateUrl: csvRow[20],
        learningHours: csvRow[12].slice(0, 4),
        university: csvRow[6],
        enrollmentTime: Date.parse(csvRow[7]) || null,
        classStartTime: Date.parse(csvRow[8]) || null,
        classEndTime: Date.parse(csvRow[9]) || null,
        lastCourseActivityTime: Date.parse(csvRow[10]) || null,
        completionTime: Date.parse(csvRow[18]) || null,
    }
}

const AddCourses = async () => {
    let arrays = await parser("usage.csv")
    console.log("adding courses")
    let courses = await Course.find({})
    for (let i = 1; i < arrays.length; i++) {
        let csvRow = arrays[i];

        if (!validateFullName(csvRow[0]) && courses.find(course => course.student === csvRow[0] && course.courseName === csvRow[3])) continue;
        let course = CreateCourse(csvRow)
        courses.push(course);
    }
    await Course.insertMany(courses)
    .then(crs => console.log("courses added successfully"))
    .catch(err => console.log("error in adding courses: " + err))
    
}

const AllCourses = async () => {
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    let courses = await Course.find({}).distinct("courseName")
    await mongoose.connection.close()
    return courses
}

const findByStudentAndUniversity = async (studentFio, university) => {
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    let courses = await Course.find({student: studentFio, university}).lean();
    await mongoose.connection.close()
    return courses
}

module.exports.Course = Course;
module.exports.CreateCourse = CreateCourse
module.exports.AddCourses = AddCourses;
module.exports.AllCourses = AllCourses;
module.exports.findByStudentAndUniversity = findByStudentAndUniversity;