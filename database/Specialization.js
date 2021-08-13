const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")
const { Student } = require("./Student")

const SpecializationSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    specializationName: String,
    courseCount: Number,
    completedCoursesCount: Number,
    isCompleted: Boolean,
    university: String,
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
})

const AddSpecializations = async () => {
    let arrays = await parser("specialization.csv")
    console.log("adding specializations");
    for (let i = 1; i < arrays.length; i++) {
        let row = arrays[i]
        let filter = {
            fullName: row[0]
        }
        if (!validateFullName(row[0])) continue;
        await Student.findOne({ fullName: filter.fullName })
            .populate("specializations")
            .then(async student => {
                if (student.specializations.find(spec => spec.specializationName === row[3])) return;
                await Specialization.create({
                    student: student._id,
                    specializationName: row[3],
                    courseCount: parseInt(row[9]),
                    completedCoursesCount: parseInt(row[8]),
                    isCompleted: row[10] === "Yes",
                    university: row[5],
                    courses: []
                })
                    .then(async spec => {
                        student.specializations.push(spec._id)
                        await student.save()
                    })
                    .catch(err => console.log("error while creating spec " + err))

            })
            .catch(err => console.log("error while finding student at adding specializaiton" + err))
    }
    console.log("Specializations added successfully")
}

const Specialization = mongoose.model("Specialization", SpecializationSchema);

module.exports.Specialization =  Specialization;
module.exports.AddSpecializations = AddSpecializations;