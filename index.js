import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import Job from './models/job.js';

const app = express();

app.use(express.json());

const port = 8000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecting to db'))
    .catch((err) => console.log('DB connection error', err));

// @desc create the job 
// @route POST api/jobs 
app.post('/api/jobs', async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @des get the jobs 
// @route GET /api/jobs
app.get('/api/jobs', async(req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @des get the single job by id
// @route GET /api/jobs/:id 
app.get('/api/jobs/:id', async(req, res) => {
    try {
        const job =  await Job.findById(req.params.id);
        if(!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// @des update the job
// @route PUT /api/jobs:id 
app.put('/api/jobs/:id', async(req, res) => {
    try {
        const job =  await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @des delete a job
// @route DELETE /api/jobs/:id 
app.delete('/api/jobs/:id', async(req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if(!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json({ message: 'Job delete successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});