const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const { CourseSchema } = require("./Course.js")
const { StudentSchema } = require("./Student.js")

const ModuleSchema = new Schema({
    moduleName: String,
    //assignments: [{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'Assignment'
    //}]
})

const AddModules = async () => {
    console.log("adding modules")
    const arrays = await parser("urfu.csv")
    for (let i = 1; i < arrays.length; i++) {
        const row = arrays[i];
        await Student.findOne({ fullName: row[3] })
            .then(async student => {
                if (!student) return;
                let course = student.specializations.
                find(spec => spec.courses.find(course => course.courseName === row[5]))
                .courses.find(course => course.courseName === row[5])

                let module = {
                    moduleName: row[6],
                    assignments: []
                }

                course.modules.push(module._id)
                await student.save()


            })
    }
    console.log("modules added successfully")
}

module.exports.ModuleSchema = ModuleSchema;
module.exports.AddModules = AddModules;