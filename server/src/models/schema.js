// Import required modules
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    type: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const complaintSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    complaintDetails: { type: String, required: true },
    status: { type: String, default: 'pending' },
    agent: { type: String,required:true},
    createdAt: { type: Date, default: new Date() }
});

const agentSchema = new mongoose.Schema({
    complaintId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    createdAt: { type: Date, default: new Date() }
});


const notificationSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    senderId: { type: String, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });

  const agentNotificationSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    senderId: { type: String, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });
  

const communicationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: new Date() }
});

const analyticsSchema = new mongoose.Schema({ /* Fields for generating reports and analytics */ });


// Define models using the schemas
const Customer = mongoose.model('Customer', customerSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const Agent = mongoose.model('Agent', agentSchema);
const Communication = mongoose.model('Communication', communicationSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);
const Notification = mongoose.model('Notification',notificationSchema);
const AgentNotification = mongoose.model('AgentNotification', agentNotificationSchema);

// Export the models
module.exports = {
    Customer,
    Complaint,
    Agent,
    Communication,
    Analytics,
    Notification,
    AgentNotification
};
