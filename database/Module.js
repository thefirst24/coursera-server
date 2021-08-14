const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")

const ModuleSchema = new Schema({
    moduleName: String,
    student: String,
    courseName: String,
    assignments: []
})

const createAssignment = (row) => {
    return {
        assignmentName: row[8],
        assignmentOrder: row[9],
        attemptGrade: row[10],
        gradeAfterOverride: row[11],
        isAttemptPassed: row[12] === "Yes",
        attemptTimestamp: row[13],
        itemAttemptOrderNumber: row[14]
    }
}

const Module = mongoose.model("Module", ModuleSchema);

const AddModules = async () => {
    console.log("adding modules")
    const arrays = await parser("urfu.csv")
    const modules = await Module.find({})
    for (let i = 1; i < arrays.length; i++) {
        const row = arrays[i];
        let assignment = createAssignment(row)
        let module = {
            moduleName: row[6],
            student: row[3],
            courseName: row[5],
            assignments: [assignment]
        }
        if (!validateFullName(row[3])) continue;
        let found = modules.find(mod => mod.student === module.student && module.moduleName === mod.moduleName)
        if (found) {
            found.assignments.push(assignment)
        }
        else {
            modules.push(module);
        }   
    }
    await Module.insertMany(modules)
    .then(mds => console.log("modules added successfully"))
    .catch(err => console.log("error while adding modules: " + err));
    
}

module.exports.Module = Module;
module.exports.AddModules = AddModules;