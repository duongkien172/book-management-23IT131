const express = require('express');
const { BookRead, BookWrite } = require('../models/Book');
const router = express.Router();

const SID    = process.env.STUDENT_ID;
const PREFIX = SID.slice(-3);               // last 3 characters of MSSV -> "131"
const VAT    = Number(SID.slice(-1)) + 6;   // (last digit + 6) % -> 7

router.get('/', async (req, res) => {          // READ -> reader account
  req.session.views = (req.session.views || 0) + 1;
  const flash = req.session.flash; delete req.session.flash;
  const books = await BookRead.find().sort({ createdAt: -1 }).lean();
  res.render('books', { books, flash, views: req.session.views,
                        sessionId: req.sessionID.slice(0, 8) });
});

router.post('/books', async (req, res) => {    // WRITE -> writer account
  const { code, title, author } = req.body;
  const price = parseFloat(req.body.price);

  if (!code || !code.startsWith(PREFIX)) {     // personalised filter
    req.session.flash = { type: 'error',
      msg: 'Rejected: product code must start with ' + PREFIX };
    return res.redirect('/');
  }
  if (!title || !author || isNaN(price) || price < 0) {
    req.session.flash = { type: 'error', msg: 'Invalid input.' };
    return res.redirect('/');
  }
  if (await BookRead.findOne({ code }).lean()) {   // duplicate check via READ
    req.session.flash = { type: 'error', msg: 'Code already exists.' };
    return res.redirect('/');
  }
  const priceAfterTax = Math.round(price * (1 + VAT / 100) * 100) / 100;
  await BookWrite.create({ code, title, author, price,
                           vatPercent: VAT, priceAfterTax });
  req.session.flash = { type: 'ok',
    msg: 'Saved. VAT ' + VAT + '% applied -> ' + priceAfterTax };
  res.redirect('/');
});

module.exports = router;