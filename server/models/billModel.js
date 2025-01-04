import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  billType: {
    type: String,
    enum: ['Electricity', 'Water', 'Gas', 'Internet', 'Rent', 'Other'],
    required: true
  },
  description:{
   type: String,
   default:""
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  billImage: {
    type: String,  // URL or base64 string
    required: true  
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Bill = mongoose.model('Bills', billSchema);

export default Bill;
