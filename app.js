import express from 'express';
import { connectDB } from './config/db.js';
import router from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js'
import session from 'express-session';
// import nocache from 'nocache';
//changed vse
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 9000;
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: '1233132',
  resave: false,
  saveUninitialized: false
}));

// app.use(nocache());
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/', router);
app.use('/', adminRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
