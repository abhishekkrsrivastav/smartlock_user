// Api Documentation
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Packages imports
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// db import
import db from './config/db.js';

// routes imports
import adminRoutes from './routes/adminRoutes.js'
import faceRoute from './routes/face recognition/faceRoute.js'
import smartLockRoute from './routes/smartlock/smartLockRoute.js'
import voiceRoute from './routes/voice command/voiceRoute.js';
import deviceRoute from './routes/Devices/deviceRoute.js'
import userRoute from './routes/users/userRoute.js'
import assignServiceRoute from './routes/assign services/assignServiceRoute.js'
import aiServiceRoute from './routes/ai services/aiServiceRoute.js'


// swagger api config
const options = {
    definition: {
        openapi: "3.0.4",
        info: {
            title: "SmartLock Project",
            description: "Node Expressjs SmartLock Project"
        },
        servers: [{
            url: "https://smartlock-user.onrender.com"
        }]
    },
    apis: ['./routes/**/*.js'],
}

const spec = swaggerJSDoc(options);


// rest object
const app = express();

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec))



// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


// api for smartlock
app.use("", smartLockRoute)

// api for users
app.use("", userRoute)

// api for devices
app.use("", deviceRoute)

// api for ai services
app.use("", aiServiceRoute)

// api for assign services
app.use("", assignServiceRoute)

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


