const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. உங்களின் MongoDB Connection String
const mongoURI = 'mongodb://vinothvinoth8187_db_user:vinoth123@ac-iszq5xc-shard-00-00.n80b29f.mongodb.net:27017,ac-iszq5xc-shard-00-01.n80b29f.mongodb.net:27017,ac-iszq5xc-shard-00-02.n80b29f.mongodb.net:27017/medicineApp?ssl=true&replicaSet=atlas-56hbho-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Database வெற்றிகரமாக இணைக்கப்பட்டது!'))
    .catch((err) => console.error('❌ Database Connection Error:', err));

// 2. ஆர்டர் Schema 
const orderSchema = new mongoose.Schema({
    id: String,
    customerDetails: String,
    medicineStr: String,
    totalAmount: Number,
    deliveryTime: String,
    status: { type: String, default: 'Active' },
    cancelReason: String,
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ஆர்டரை Save செய்வதற்கான API
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save(); 
        res.status(200).json({ success: true, message: 'Order placed in Database!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ஆர்டர்களை எடுக்கும் API
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// மாத்திரைகளுக்கான கோடு (MEDICINES) - EDIT & DELETE சேர்க்கப்பட்டுள்ளது
// ==========================================

const medicineSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    company: String,
    dosage: String,
    image: String
});
const Medicine = mongoose.model('Medicine', medicineSchema);

// மாத்திரைகளை எடுப்பதற்கான API (GET)
app.get('/api/medicines', async (req, res) => {
    try {
        const meds = await Medicine.find();
        res.status(200).json(meds);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// புதிய மாத்திரையை Save செய்வதற்கான API (POST)
app.post('/api/medicines', async (req, res) => {
    try {
        const newMed = new Medicine(req.body);
        await newMed.save();
        res.status(200).json({ success: true, message: 'Medicine added to Database!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// **புதியது: மாத்திரையை எடிட் (Update) செய்ய (PUT API)**
app.put('/api/medicines/:id', async (req, res) => {
    try {
        await Medicine.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Medicine updated globally!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// **புதியது: மாத்திரையை டெலீட் (Delete) செய்ய (DELETE API)**
app.delete('/api/medicines/:id', async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Medicine deleted globally!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend Server is running on port ${PORT}`);
});