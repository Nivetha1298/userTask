
import { Connection, FindOneOptions, getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserDao {
  private userRepository = getRepository(User);
  constructor(private connection: Connection) {
    this.userRepository = this.connection.getRepository(User);
  }

  async createUser(username: string, password: string, email: string): Promise<User> {
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.email = email;
    return this.userRepository.save(newUser);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
   
    const options: FindOneOptions<User> = {
      where: { username },
    };

    return this.userRepository.findOne(options);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    
    const options: FindOneOptions<User> = {
      where: { email }, 
    };

    return this.userRepository.findOne(options);
  }
}
