const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")

const ModuleSchema = new Schema({
    moduleName: String,
    //assignments: [{
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: 'Assignment'
    //}]
})

const AddModules = async () => {
    const { Student } = require("./Student.js")
    console.log("adding modules")
    const arrays = await parser("urfu.csv")
    for (let i = 1; i < arrays.length; i++) {
        const row = arrays[i];
        await Student.findOne({ fullName: row[3] })
            .then(async student => {
                if (!student) return;

                let specialization = student.specializations.find(spec => spec.courses.find(course => 
                {
                    if (course !== null)
                        return course.courseName === row[5] 
                    return false;
                }))
                if (!specialization) return;
                let course = specialization.courses.find(course => {
                    if (course !== null)
                        return course.courseName === row[5] 
                    return false;
                })

                let module = {
                    moduleName: row[6],
                    assignments: []
                }

                if (!course.modules.find(mod => mod.moduleName === module.moduleName)) {
                    course.modules.push(module)
                    await student.save()
                }
            })
            .catch(err => {
                return console.log("error while adding modules: " + err)
            }) 
    }
    console.log("modules added successfully")
}

module.exports.ModuleSchema = ModuleSchema;
module.exports.AddModules = AddModules;