import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import db from './config/db.js';
import adminRoutes from './routes/adminRoutes.js'
import faceRoute from './routes/face recognition/faceRoute.js'
import smartLockRoute from './routes/smartlock/smartLockRoute.js'
import voiceRoute from './routes/voice command/voiceRoute.js';



const app = express();



// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


// api for smartlock
app.use("", smartLockRoute)


// api for face-recognisation
app.use("/api", faceRoute);

// routes for user
// app.use('/api/user', userRoutes);

// routes for voice command
app.use('/api', voiceRoute)

// routes for admin || xrda3 panel
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


