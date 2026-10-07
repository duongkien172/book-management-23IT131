require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
app.set('trust proxy', 1);
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

app.locals.fullName  = process.env.FULL_NAME;
app.locals.studentId = process.env.STUDENT_ID;
app.locals.vat       = Number(process.env.STUDENT_ID.slice(-1)) + 6;

// ---- SESSION (branch feature/session) -------------------------------
// (session block goes here)
// ---------------------------------------------------------------------


// ---- ROUTES (branch feature/database) -------------------------------
// (routes block goes here)
// ---------------------------------------------------------------------

app.get('/health', (req, res) => res.send('OK'));
app.listen(process.env.PORT || 3000, () => console.log('Server started'));