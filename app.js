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
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI_WRITE,
    dbName: 'DB_' + process.env.STUDENT_ID,
    collectionName: 'sessions',
    ttl: 60 * 60
  }),
  cookie: { httpOnly: true, maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production' }
}));// ---------------------------------------------------------------------


// ---- ROUTES (branch feature/database) -------------------------------
app.use('/', require('./routes/books'));// ---------------------------------------------------------------------

app.get('/health', (req, res) => res.send('OK'));
app.listen(process.env.PORT || 3000, () => console.log('Server started'));