import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import keywordRoutes from './routes/keywordRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
 
 

const app = express();

 

// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());




// routes for user
app.use('/api/user', userRoutes);

// routes for keywords
app.use('/api', keywordRoutes)

// routes for admin
app.use("/api/admin", adminRoutes);


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


