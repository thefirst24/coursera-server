const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AssignmentSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    assignmentOrder: Number,
    attemptGrade: Number,
    gradeAfterOverride: Number,
    isAttemptPassed: Boolean,
    attemptTimestamp: Date,
    itemAttemptOrderNumber: Number
})

const Assignment = mongoose.model("Assignment", AssignmentSchema);

export default Assignment;