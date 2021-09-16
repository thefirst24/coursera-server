const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateFullName = require("../utils/ValidateFullName.js")
const parser = require("../utils/CsvParser.js")

const dbUrl = "mongodb://127.0.0.1:27017/"

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
    }
    await Specialization.insertMany(specializations).
    then(() => console.log("Specializations added successfully"))
    .catch(err => console.log("error while adding specializations: " + err))
}

const allSpecializations = async () => {
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    let specs = await Specialization.find({}).distinct("specializationName")
    await mongoose.connection.close()
    return specs
}

const findByName = async (specializationName) => {
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    const specializations = await Specialization.find({specializationName: specializationName});
    await mongoose.connection.close()
    return specializations;
}



module.exports.Specialization = Specialization;
module.exports.AddSpecializations = AddSpecializations;
module.exports.allSpecializations = allSpecializations;
module.exports.findByName = findByName;