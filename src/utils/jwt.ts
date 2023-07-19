import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';

export function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
  };

 
  const expiresIn = '1h';

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  return token;
}

export function verifyToken(token: string): Promise<any> {
    console.log("fish" , token)
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
}