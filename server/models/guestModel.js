const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Guest must have a Name'],
        trim: true,
    }, 
    host: {
        type: mongoose.Schema.ObjectId,
        ref: 'Host',
        required: [true, 'Review must belong to a tour'],
    },
});


const Guest = mongoose.model('Guest', guestSchema);


module.exports = Guest;