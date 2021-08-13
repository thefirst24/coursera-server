const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AssignmentSchema = new Schema({
    assignmentOrder: Number,
    attemptGrade: Number,
    gradeAfterOverride: Number,
    isAttemptPassed: Boolean,
    attemptTimestamp: Date,
    itemAttemptOrderNumber: Number
})

export default AssignmentSchema;