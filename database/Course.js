const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const { ModuleSchema } = require("./Module.js")

const CourseSchema = new Schema({
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
    modules: [ModuleSchema]
})

const CreateCourse = async (csvRow) => {
    return {
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
    }
}

const AddCourses = async () => {
    const { Student } = require("./Student.js")
    let arrays = await parser("usage.csv")
    console.log("adding courses")
    for (let i = 1; i < arrays.length; i++) {
        let csvRow = arrays[i];

        if (!validateFullName(csvRow[0])) continue;

        await Student.findOne({ fullName: csvRow[0] })
            .then(async student => {
                if (student === null) return;
                let course = await CreateCourse(csvRow)
                let specialization = student.specializations.find(spec => spec.university === course.university);
                if (!specialization) {
                    let noSpec = student.specializations.find(spec => spec.specializationName === "Курсы без специализации");
                    if (!noSpec) {
                        let completed = course.isCompleted ? 1 : 0
                        let courseCount = 1
                        let specializationWithoutCourses = {
                            specializationName: "Курсы без специализации",
                            courseCount: 1,
                            completedCoursesCount: completed,
                            isCompleted: completed === courseCount,
                            university: '',
                            courses: [course]
                        }
                        student.specializations.push(specializationWithoutCourses)
                        await student.save()
                    }
                    else {
                        let spec = student.specializations.find(spec => spec.specializationName === "Курсы без специализации");
                        if (!spec.courses.find(crs => crs.courseName === course.courseName)) {
                            spec.courses.push(course)
                            await student.save()
                        }
                    }
                }
                else {  
                    let spec = student.specializations.find(spec => spec.university === course.university)
                    if (!spec.courses.find(crs => crs.courseName === course.courseName)) {
                        spec.courses.push(course)
                        await student.save()
                    }
                    
                }

            })
            .catch(err => console.log(err))
    }
    console.log("courses added successfully")
}

module.exports.CourseSchema = CourseSchema;
module.exports.CreateCourse = CreateCourse
module.exports.AddCourses = AddCourses;