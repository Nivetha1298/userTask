
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserDao } from "../dao/userDao";
import { Connection, createConnection } from "typeorm";
import { loginSchema, registerSchema } from "../validation/userValidation";
import { generateToken } from "../utils/jwt";
import { User as IUser } from "../interfaces/User";


const router = express.Router();

// Create an instance of UserDAO using the Connection object
createConnection().then((connection: Connection) => {
    const userDao = new UserDao(connection);
    

router.post("/register", async (req: Request, res: Response) => {

    const { error , value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Validation error", details: error.details });
  }

  const { username, password, email }:IUser = value;

  try {
    // Check if the username already exists
    const existingUser = await userDao.findUserByUsername(username);

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the email is already registered
    const existingEmail = await userDao.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await userDao.createUser(username, hashedPassword, email);

   
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post('/login', async (req: Request, res: Response) => {
    const { error , value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details });
    }
    const { username, password }:IUser = value
  
    try {
      const user = await userDao.findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = generateToken(user);
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });



  

})


export const authRoutes = router;
