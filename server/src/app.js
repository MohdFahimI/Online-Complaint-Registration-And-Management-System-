const express = require("express");
const bcrypt = require('bcrypt')
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5100;
const mongoose = require('mongoose');
const { MONGO_URI } = require('./db/connect');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const models = require("./models/schema");
const multer = require('multer');


app.use(cors());



// user schema
app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, username, type, email, password } = req.body;
        const user = await models.Customer.findOne({ email });

        if (user) {
            return res.status(400).send('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user object
        const newUser = new models.Customer({
            firstname,
            lastname,
            username,
            type,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        const userCreated = await newUser.save();
        console.log(userCreated, 'user created');
        return res.status(201).send('Successfully Registered');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await models.Customer.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isAdmin = email == 'virat@gmail.com' && password == 'virat@1234';
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    if (!isAdmin && user.type === 'agent') {
        const agentToken = jwt.sign({ userId: user._id }, 'agenttoken');
        res.json({ user, agentToken });
    } else if (!isAdmin && user.type === 'user') {
        const token = jwt.sign({ userId: user._id }, 'mysecretkey1');
        res.json({ user, token });
    } else if (user.type === 'admin') {
        const jwtToken = jwt.sign({ userId: user._id }, 'mysecretkey2');
        res.json({ user, jwtToken });
    }
});


app.get('/users', async (req, res) => {
    try {
        const users = await models.Customer.find();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});


app.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await models.Customer.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server Error' });
    }
});





app.post('/complaints', async (req, res) => {
    try {
        // Extract the customer and complaint details from the request body
        const { customer, complaintDetails } = req.body;

        // Create a new complaint instance
        const newComplaint = new models.Complaint({
            customer,
            complaintDetails,
            agent: ' ',
            createdAt: new Date()
        });

        // Save the new complaint to the database
        const savedComplaint = await newComplaint.save();

        res.status(201).json(savedComplaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/complaints/:id/update-status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const complaint = await models.Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        complaint.status = status;
        const updatedComplaint = await complaint.save();

        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/complaints', async (req, res) => {
    try {
        // Retrieve all complaints from the database
        const complaints = await models.Complaint.find();

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/agents-complaints/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Retrieve complaints for the specified userId from the database
        const complaints = await models.Agent.find({ agentId: userId })
            .populate('complaintId') // Populate complaint details excluding agentId
            .populate('customerId');

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// Create a new agent
app.post('/agents-complaints/:id', async (req, res) => {
    try {
        const { customerId, agentId, complaintId } = req.body;
        const newAgent = new models.Agent({
            customerId,
            agentId,
            complaintId,
        });

        const agentComplaintCreated = await newAgent.save();
        const complaintDetails = await models.Complaint.findById(complaintId);

        complaintDetails.agent = agentId;
        const updatedComplaint = await complaintDetails.save();
        agentComplaintCreated.complaintDetails = complaintDetails;

        return res.status(201).json(agentComplaintCreated);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server Error' });
    }
});


app.get('/complaints/:id', async (request, response) => {
    try {
        const agentId = request.params.id;
        const complaints = await models.Complaint.find({ agent: agentId }).populate('customer');
        response.send(complaints);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: 'Server Error' });
    }
});


app.get('/customer-complaints/:id', async (request, response) => {
    try {
        const agentId = request.params.id;
        const complaints = await models.Complaint.find({ customer: agentId }).populate('customer');
        response.send(complaints);
    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: 'Server Error' });
    }
});



app.get('/user-complaints/:id', async (req, res) => {
    try {
        const id = req.params.id
        const complaints = await models.Complaint.find({customer:id});

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Create a new communication
app.post('/messages', async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        const newMessage = new models.Communication({
            senderId,
            receiverId,
            content,
            createdAt: Date.now()
        });
        const savedMessage = await newMessage.save();

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create a new message.' });
    }
});


// Retrieve all communications
app.get('/messages', async (req, res) => {
    try {
        const messages = await models.Communication.find();
        const senderIds = messages.map(message => message.senderId);
        const receiverIds = messages.map(message => message.receiverId);

        const senders = await models.Customer.find({ _id: { $in: senderIds } });
        const receivers = await models.Customer.find({ _id: { $in: receiverIds } });
        const messagesWithUsers = messages.map(message => {
            const sender = senders.find(user => user._id.equals(message.senderId));
            const receiver = receivers.find(user => user._id.equals(message.receiverId));
            return { ...message._doc, sender, receiver };
        });

        res.json(messagesWithUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});


// Get all notifications for a user
app.get('/notifications/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await models.Notification.find({ userId });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notifications.' });
    }
});


app.get('/agent-notifications/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const notifications = await models.AgentNotification.find({ userId }).populate({
        path: 'senderId',
        model: 'Customer',
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve notifications.' });
    }
  });
  
  

// Create a new notification
app.post('/notifications', async (req, res) => {
    try {
        console.log(req.body);
        const { userId, senderId, content } = req.body;
        const notification = await models.Notification.create({ userId, senderId, content });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create notification.' });
    }
});


// Create a new notification
app.post('/agent-notifications', async (req, res) => {
    try {
        console.log(req.body);
        const { userId, senderId, content } = req.body;
        const notification = await models.AgentNotification.create({ userId, senderId, content });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create notification.' });
    }
});


app.delete('/notifications/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await models.Notification.deleteMany({ userId });

        res.status(200).json({ message: 'Notifications deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete notifications.' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


module.exports = app;