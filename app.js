const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)

dotenv.config({ path: './config/.env' }) // Setup environment variables

connectDB() // Connecting to MongoDB database
require('./config/passport')(passport) // Setup passport for sessions and user authentication

const app = express()

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public'))) // Static folder

// Handlebar helpers
const { formatDate } = require('./helpers/hbs')

// Templating engine
app.engine('.hbs', exphbs({ helpers: { formatDate }, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

// Session and passport
app.use(session({
    secret: 'dead afro',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 5000 

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/feed', require('./routes/feed'))
app.use('/follow', require('./routes/follow'))
app.use('/account', require('./routes/account'))
app.use('/community', require('./routes/community'))
app.use('/post', require('./routes/post'))
app.use('/search', require('./routes/search'))

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})