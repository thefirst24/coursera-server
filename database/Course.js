const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const { Student } = require("./Student")
const {Specialization} = require("./Specialization.js")

const CourseSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
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
    modules:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }]
})

const Course = mongoose.model("Course", CourseSchema);

const CreateCourse = (csvRow, student) => {
    return Course.create({
        student: student._id,
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
        modules: []
    })
}

const AddCourses = async () => {
    let arrays = await parser("usage.csv")
    console.log("adding courses")
    for (let i = 1; i < arrays.length; i++) {
        let csvRow = arrays[i];

        if (!validateFullName(csvRow[0])) continue;

        await Student.findOne({ fullName: csvRow[0] })
            .populate("specializations")
            .then(async student => {
                await CreateCourse(csvRow, student)
                    .then(async course => {
                        let specialization = student.specializations.find(spec => spec.university === course.university);
                        if (!specialization) {
                            let noSpec = student.specializations.find(spec => spec.specializationName === "Курсы без специализации");
                            if (!noSpec) {
                                let completed = course.isCompleted ? 1 : 0
                                let courseCount = 1
                                await Specialization.create({
                                    student: student._id,
                                    specializationName: "Курсы без специализации",
                                    courseCount: 1,
                                    completedCoursesCount: completed,
                                    isCompleted: completed === courseCount,
                                    university: '',
                                    courses: [course._id]
                                })
                                    .then(async spec => {
                                        student.specializations.push(spec)
                                        await student.save()
                                    })
                                    .catch(err => console.log("error while creating empty spec " + err))
                            }
                            else {
                                let spec = student.specializations.find(spec => spec.specializationName === "Курсы без специализации");
                                let id = spec._id;
                                let courses = spec.courses
                                await Specialization.findByIdAndUpdate(id, { courses: [...courses, course._id] })
                            }
                        }
                        else {
                            let spec = student.specializations.find(spec => spec.university === course.university)
                            let id = spec._id;
                            let courses = spec.courses
                            await Specialization.findByIdAndUpdate(id, { courses: [...courses, course._id] })
                        }
                    })
                    .catch(err => console.log("error while saving student at adding courses " + err))
            })
            .catch(err => console.log(err))
    }
    console.log("courses added successfully")
}

module.exports.Course = Course;
module.exports.CreateCourse = CreateCourse
module.exports.AddCourses = AddCourses;