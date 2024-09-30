const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complainer :{
    type :mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  },
  title: { 
    type: String, 
    required: true 
  },  
  body: { 
    type: String, 
    required: true 
  },  
  date: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved'], 
    default: 'Open' 
  }
});

const complaint = mongoose.model('Complaint', complaintSchema);

export default complaint;
