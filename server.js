import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js'
// import keywordRoutes from './routes/keywordRoutes.js'


const app = express();
// dotenv
dotenv.config();

// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


// routes for user
app.use('/api/user', userRoutes);

// routes for keywords
// app.use('/api', keywordRoutes)



// port
const PORT = process.env.PORT || 8888;

//  conditionally listen
db.query('SELECT 1').then(() => {

    // mysql
    console.log('MYSQL DB Connected');


    // listen
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);

})


