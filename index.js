const express = require('express');
const cors = require('cors');
const path = require('path'); // <--- Add this line

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const jobsRoutes= require('./routes/jobRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
