const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")

const SpecializationSchema = new Schema({
    student: String,
    specializationName: String,
    courseCount: Number,
    completedCoursesCount: Number,
    isCompleted: Boolean,
    university: String,
})

const Specialization = mongoose.model("Specialization", SpecializationSchema);

const AddSpecializations = async () => {
    let arrays = await parser("specialization.csv")
    console.log("adding specializations");
    let specializations = await Specialization.find({})
    for (let i = 1; i < arrays.length; i++) {
        let row = arrays[i]
        if (!validateFullName(row[0])) continue;
        if (specializations.find(spec => spec.student === row[0] && spec.specializationName === row[3])) continue

        specializations.push({
            student: row[0],
            specializationName: row[3],
            courseCount: parseInt(row[9]),
            completedCoursesCount: parseInt(row[8]),
            isCompleted: row[10] === "Yes",
            university: row[5],
        })
        //if (!specializations.find(spec => spec.student === row[0] && spec.specializationName === "Курсы без специализации"))
        //    specializations.push({
        //        student: row[0],
        //        specializationName: "Курсы без специализации",
        //        courseCount: 0,
        //        completedCoursesCount: 0,
        //        isCompleted: true,
        //        university: '',
        //    })
    }
    await Specialization.insertMany(specializations).
    then(() => console.log("Specializations added successfully"))
    .catch(err => console.log("error while adding specializations: " + err))
}



module.exports.Specialization = Specialization;
module.exports.AddSpecializations = AddSpecializations;