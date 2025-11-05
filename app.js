const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: 'https://garbage-management.netlify.app', // ✅ Allow only Angular frontend
    credentials: true, // ✅ Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // ✅ Allowed HTTP methods
  })
);
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));



// Import routes
const authRoutes = require('./routes/auth');
const wardRoutes = require('./routes/ward');
const empRoutes = require('./routes/employee');
const complaintRoutes = require('./routes/complaint');
const userRoutes = require('./routes/user');
const contactRoutes = require('./routes/contact');

const wasteReportRoutes = require('./routes/wasteReports');
app.use('/api/waste-reports', wasteReportRoutes);



app.use('/api/auth', authRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/emp', empRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/contact', contactRoutes);







// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
