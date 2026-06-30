import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import Job from './models/job.js';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import protect from './middleware/authMiddleware.js';

const app = express();

app.use(express.json());

const port = 8000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connecting to db'))
    .catch((err) => console.log('DB connection error', err));

// @desc create the job 
// @route POST api/jobs 
app.post('/api/jobs', protect, async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @des get the jobs 
// @route GET /api/jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @des get the single job by id
// @route GET /api/jobs/:id 
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// @des update the job
// @route PUT /api/jobs:id 
app.put('/api/jobs/:id', protect, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @des delete a job
// @route DELETE /api/jobs/:id 
app.delete('/api/jobs/:id', protect, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.status(200).json({ message: 'Job delete successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// @desc register a new User 
// @route POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User alrady exist' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ id: user._id, name: user.name, email: user.email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// @desc login a User 
// @route POST /api/auth/signup
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credential' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credential' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token, id: user._id, name: user.name, email: user.email });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});