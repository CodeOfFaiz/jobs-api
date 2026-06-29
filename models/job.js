import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    salary: { type: Number },
    description: { type: String },
    type: { type: String },
    postedBy: { type: String },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;