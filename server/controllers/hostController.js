const Host = require('../models/hostModel');
const factory = require('./handlerFactory');



exports.getAllHosts = factory.getAll(Host);
exports.deleteHost = factory.deleteOne(Host);
exports.updateHost = factory.updateOne(Host);
exports.createHost = factory.createOne(Host);
exports.getHost = factory.getOne(Host);