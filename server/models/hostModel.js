const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Host must have a Name'],
        trim: true,
    }, 
    spotifyAccessToken: {
        type: String,
        required: [true, 'Host must have a Access Token'],
    }
});

hostSchema.virtual('guests', {
    ref: 'Guest',
    foreignField: 'guest',
    localField: '_id',
});

const Host = mongoose.model('Host', hostSchema);


module.exports = Host;