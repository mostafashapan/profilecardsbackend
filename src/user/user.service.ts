import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.model';
import { AddUserInput } from './dto/add-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { FileUpload } from 'graphql-upload-ts';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';  // Import ConfigService
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,  // Inject ConfigService
  ) {}

  // Example of using the ConfigService to get a value from .env
  getDatabaseUrl(): string {
    const dbUrl = this.configService.get<string>('DATABASE_URL');
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not set in the environment variables');
    }
    return dbUrl;
  }

  // Find one user by ID
  async findOneById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // Find all users with optional pagination
  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const users = await this.userRepository.find({
      skip: (page - 1) * limit, // Paginate the results
      take: limit,              // Limit the results to the page size
    });
    return users;
  }

  // Add a new user
 // Add a new user
async addUser(addUserInput: AddUserInput, photo?: FileUpload | string): Promise<User> {
    const user = this.userRepository.create(addUserInput); // Create user entity from input data
  
    if (photo) {
      user.photo = await this.handleFileUpload(photo); // Handle photo upload if provided
    }
  
    return this.userRepository.save(user); // Save the new user to the database
  }

  // Update an existing user
  async update(id: number, updateUserInput: UpdateUserInput, photo?: FileUpload): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateUserInput); // Update the user with the new data

    if (photo) {
      user.photo = await this.handleFileUpload(photo); // Handle photo upload if provided
    }

    return this.userRepository.save(user); // Save the updated user to the database
  }


  // Delete users by their IDs
  async deleteUsers(ids: number[]): Promise<boolean> {
    const result = await this.userRepository.delete(ids);
  
    // Check if 'affected' is null or undefined before using it
    if (result.affected == null) {
      return false; // Return false if 'affected' is null or undefined
    }
  
    return result.affected > 0; // Return true if any rows were deleted, false otherwise
  }

  // Private method to handle file upload
//   private async handleFileUpload(photo: FileUpload): Promise<string> {
//     // This should be an actual file upload handler (e.g., storing the file on the server or cloud)
//     const filePath = `/uploads/${photo.filename}`; // Just a mock file path for now
//     return filePath;
//   }
private async handleFileUpload(photo: FileUpload | string): Promise<string> {
    if (typeof photo === 'string') {
      // If photo is a string, assume it's a URL and return it as is.
      return photo;
    }

    // If photo is a FileUpload object, handle the file upload to the local server.
    const uploadDir = path.join(__dirname, '..', 'uploads'); // Define upload directory
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });  // Create the directory if it doesn't exist
    }

    const fileExtension = path.extname(photo.filename); // Get the file extension
    const newFileName = `${uuid.v4()}${fileExtension}`;  // Generate a unique file name
    const filePath = path.join(uploadDir, newFileName);

    // Create a write stream and pipe the file data into the new location
    const writeStream = fs.createWriteStream(filePath);
    photo.createReadStream().pipe(writeStream);

    // Return the file path once the upload is complete
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(`/uploads/${newFileName}`);
      });
      writeStream.on('error', (error) => {
        reject(new HttpException('Error uploading file', HttpStatus.INTERNAL_SERVER_ERROR));
      });
    });
  }


  // Check database connection
  async checkDbConnection(): Promise<string> {
    try {
      await this.userRepository.query('SELECT 1');
      return 'Database connection is active';
    } catch (error) {
      throw new HttpException('Database connection failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
