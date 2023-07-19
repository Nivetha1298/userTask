
import "reflect-metadata";
import { DataSource } from "typeorm";
import express from "express";
import path from 'path'
import swaggerUi from 'swagger-ui-express-subtags';
import YAML from 'yamljs'
import helmet from 'helmet'
import { User } from "./entity/User";
import {authRoutes} from "./routes/authRoute"
import dotenv from 'dotenv';
import { formRoutes } from "./routes/formRoute";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());



// Set Content Security Policy (CSP) 
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://unpkg.com;"
  );
  next();
});


 const swaggerYamlPath = path.join(__dirname, 'swagger', 'swagger.yaml');
 console.log(swaggerYamlPath   , "kite")
 const apiDocument = YAML.load(swaggerYamlPath);

//  Serve Swagger UI at a specific endpoint
 app.use('/user/docs', swaggerUi.serve, swaggerUi.setup(apiDocument));





const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [User],
});

AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.log(error));
  app.use("/auth", authRoutes);
  app.use("/form" , formRoutes)
 
  
  

 
  export default app;