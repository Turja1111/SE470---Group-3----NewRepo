import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    option1: {
        type: [String],
        required: true,
    },
    option2: {
        type: [String],
        required: true,
    },
    option3: {
        type: [String],
        required: true,
    },
    option4:
    {
        type: [String],
        required: true,
    },
    resource: {
        type: String,
        required: true,
    },
    correct: {
        type: Number,
        required: true,
    },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;