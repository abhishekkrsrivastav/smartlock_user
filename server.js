import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import keywordRoutes from './routes/keywordRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import navbarRoutes from './routes/navbarRoutes.js'
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();



// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

 
app.use("/api", uploadRoutes);

// routes for user
app.use('/api/user', userRoutes);

// routes for keywords
app.use('/api', keywordRoutes)

// routes for admin || xrda3 panel
app.use("/api/admin", adminRoutes);

// routes for noon backend
app.use('/noon', navbarRoutes);

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


