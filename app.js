const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

dotenv.config({ path: './config/.env' }) // Setup environment variables

connectDB() // Connecting to MongoDB database

const app = express()

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public'))) // Static folder

// Templating engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

const PORT = process.env.PORT || 5000 

// Routes
app.use('/', require('./routes/index'))


// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})