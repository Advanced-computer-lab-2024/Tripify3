const mongoose = require('mongoose');

const tourGuideSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // Reference to the user who is a tour guide
  phoneNumber: { 
    type: String, 
    required: true 
  },  
  nationality: { 
    type: String, 
    required: true 
  },  
  dateOfBirth: { 
    type: String, 
    required: true 
  },  
  occupation: { 
    type: String, 
    required: true 
  },  
  licenseNumber: { 
    type: String, 
    required: true 
  },  
  experienceYears: { 
    type: Number, 
    required: true 
  },  
  regionSpecialization: { 
    type: String, 
    required: true 
  },  
  previousWork: [{ 
    type: String 
  }],  
  adminLevel: { 
    type: String 
  },  
  department: { 
    type: String 
  },  
  companyName: { 
    type: String 
  },  
  adBudget: { 
    type: Number 
  },  
  description: { 
    type: String 
  },  
  website: { 
    type: String 
  },  
  hotline: { 
    type: String 
  },  
  tourGuideID: { 
    type: Number 
  },  
  tourGuideCertificate: { 
    type: String 
  },  
  advertiserID: { 
    type: Number 
  },  
  advertiserTaxCard: { 
    type: String 
  },  
  sellerID: { 
    type: Number 
  },  
  sellerTaxCard: { 
    type: String 
  },
  ratings: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rating' 
  }],  // Array of ratings for the tour guide
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }]  // Array of comments for the tour guide
});

module.exports = mongoose.model('TourGuide', tourGuideSchema);
