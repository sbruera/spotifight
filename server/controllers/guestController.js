const Guest = require('../models/guestModel');
const factory = require('./handlerFactory');



exports.getAllGuests = factory.getAll(Guest);
exports.deleteGuest = factory.deleteOne(Guest);
exports.updateGuest = factory.updateOne(Guest);
exports.createGuest = factory.createOne(Guest);
exports.getGuest = factory.getOne(Guest);