const mongoose = require('mongoose');
const { readConn, writeConn } = require('../db');

const schema = new mongoose.Schema({
  code:          { type: String, required: true },
  title:         { type: String, required: true },
  author:        { type: String, required: true },
  price:         { type: Number, required: true },
  vatPercent:    { type: Number, required: true },
  priceAfterTax: { type: Number, required: true },
  createdAt:     { type: Date, default: Date.now }
}, { autoIndex: false, autoCreate: false });   // users have no createIndex/createCollection on books

module.exports = {
  BookRead:  readConn.model('Book', schema, 'books'),    // READ only
  BookWrite: writeConn.model('Book', schema, 'books')    // WRITE only
};