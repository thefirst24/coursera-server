const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const {Course} = require("./Course.js")
const { Student } = require("./Student.js")

const ModuleSchema = new Schema({
    moduleName: String,
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }]
})

const Module = mongoose.model("Module", ModuleSchema);

const AddModules = async () => {
    console.log("adding modules")
    const arrays = await parser("urfu.csv")
    for (let i = 1; i < arrays.length; i++) {
        const row = arrays[i];
        await Student.findOne({fullName: row[3]}).populate({
            path: "specializations",
            populate: {
                path: "courses",
                model: "Course"
            }
        }).then(async student => {
            if (!student) return;
            await Course.findOne({student: student._id, courseName: row[5] })
            .then(async course => {
                await Module.create({
                    moduleName: row[6],
                    student: student._id,
                    course: course._id,
                    assignments: []
                })
                .then(async module => {
                    course.modules.push(module._id)
                    await course.save()
                })
                
            })
        })
    }
    console.log("modules added successfully")
}

module.exports.Module = Module;
module.exports.AddModules = AddModules;