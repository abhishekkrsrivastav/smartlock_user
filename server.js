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

import faceRoute from './routes/face recognition/faceRoute.js'
import smartLockRoute from './routes/smartlock/smartLockRoute.js'
import voiceRoute from './routes/voice command/voiceRoute.js';
import deviceRoute from './routes/Devices/deviceRoute.js'
import userRoute from './routes/users/userRoute.js'
import assignServiceRoute from './routes/assign services/assignServiceRoute.js'
import aiServiceRoute from './routes/ai services/aiServiceRoute.js'
import subPlanRoute from './routes/subscription plan/subPlanRoute.js'
import subscriptionRoute from './routes/subscription/subscriptionRoute.js'

// swagger api config
 
const options = {
  definition: {
    openapi: "3.0.4",
    info: {
      title: "SmartLock Project",
      description: "API's Documentation for SmartLock Project"
    },
    components: {
      securitySchemes: {
        bearerToken: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerToken: []   
      }
    ],
    servers: [
      {
        url: "https://smartlock-user.onrender.com"
      }
    ]
  },
  apis: ["./routes/**/*.js"]
};



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

// api for subscription Plan
app.use("", subPlanRoute)

// api for subscription
app.use("", subscriptionRoute)
// api for face-recognisation
app.use("/api", faceRoute);

// routes for user
// app.use('/api/user', userRoutes);

// routes for voice command
app.use('/api', voiceRoute)





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


