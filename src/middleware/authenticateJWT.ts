
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'Missing authorization token' });
    }

    // Verify the token using the verifyToken function
    const decodedToken = await verifyToken(token);

    // Attach the decoded token to the request object 
    req = decodedToken; 

    next(); 
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
