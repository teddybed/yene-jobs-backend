const { Job, User } = require('../models'); // adjust path if needed

const createJob = async (req, res) => {
  try {
    const user = req.user;

    // Check authentication and role
    if (!user || !['employer', 'admin'].includes(user.role)) {
      return res.status(403).json({ message: 'Access denied. Only employers or admins can post jobs.' });
    }

    const {
      title,
      description,
      industry,
      location,
      type,
      salary,
      remote,
      deadline,
    } = req.body;

    // Validate required fields
    if (!title || !description || !type) {
      return res.status(400).json({ message: 'Title, description, and type are required.' });
    }

    // Optionally validate data types or formats here
    // Example: deadline should be a valid date string or null
    let parsedDeadline = null;
    if (deadline) {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid deadline date format.' });
      }
      parsedDeadline = date;
    }

    // remote should be boolean if provided
    let isRemote = false;
    if (remote !== undefined) {
      isRemote = Boolean(remote);
    }

    // Create job record
    const job = await Job.create({
      userId: user.id,
      title,
      description,
      industry: industry || null,
      location: location || null,
      type,
      salary: salary || null,
      remote: isRemote,
      deadline: parsedDeadline,
    });

    return res.status(201).json({
      message: 'Job posted successfully.',
      job,
    });
  } catch (error) {
    console.error('Error posting job:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const listJobs = async (req, res) => {
  try {
    const { industry } = req.params;

    const jobs = await Job.findAll({
      where: { industry },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs by industry:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


module.exports = {
  createJob,
  listJobs,
};
