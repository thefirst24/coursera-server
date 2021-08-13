const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const { CourseSchema } = require("./Course.js")

const SpecializationSchema = new Schema({
    specializationName: String,
    courseCount: Number,
    completedCoursesCount: Number,
    isCompleted: Boolean,
    university: String,
    courses:[CourseSchema]
}) 

const AddSpecializations = async () => {
    const { Student } = require("./Student.js")
    let arrays = await parser("specialization.csv")
    console.log("adding specializations");
    for (let i = 1; i < arrays.length; i++) {
        let row = arrays[i]
        let filter = {
            fullName: row[0]
        }
        if (!validateFullName(row[0])) continue;
        await Student.findOne({ fullName: filter.fullName })
            .then(async student => {
                if (student === null) return;
                if (student.specializations.find(spec => spec.specializationName === row[3])) return;
                student.specializations.push({
                    specializationName: row[3],
                    courseCount: parseInt(row[9]),
                    completedCoursesCount: parseInt(row[8]),
                    isCompleted: row[10] === "Yes",
                    university: row[5],
                    courses: []
                })
                await student.save()
            })
            .catch(err => console.log("error while finding student at adding specializaiton" + err))
    }
    console.log("Specializations added successfully")
}

module.exports.SpecializationSchema =  SpecializationSchema;
module.exports.AddSpecializations = AddSpecializations;