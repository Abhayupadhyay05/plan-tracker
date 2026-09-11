//authentication
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

export const signUp = async (req, res, next) => {
  // req.body contains data sent by the client in the POST request

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({ email });
    // First database call

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password - it means securing the password
    const salt = await bcrypt.genSalt(10);
    // Salt is used to make the hash more secure/random

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, password: hashedPassword }],
      { session }
    );

    const token = jwt.sign(
      { userId: newUsers[0]._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUsers[0],
      },
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    next(error);
  }
}


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user,
      }
    });
  } catch (error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => {}



 /*     Suppose Postman sends:

{
    "name": "Abhay",
    "email": "abhay@gmail.com",
    "password": "123456"
}

Your controller does this:
                    POST /sign-up
                         │
                         ↓
                     req.body
                         │
                         ↓
              name/email/password
                         │
                         ↓
             Is email already used?
                    /          \
                  YES           NO
                   ↓             ↓
                ERROR       Hash password
                                 │
                                 ↓
                          Save user in DB
                                 │
                                 ↓
                         Get user's _id
                                 │
                                 ↓
                          Create JWT
                                 │
                                 ↓
                       Commit transaction
                                 │
                                 ↓
                         Send response
                         
   Code	Concept
req.body	Getting client data
res.json()	Sending response
next()	Middleware/error handling
async/await	Asynchronous operations
User.findOne()	Database query
bcrypt.hash()	Password hashing
User.create()	Database insertion
jwt.sign()	Authentication token
try/catch	Error handling
throw	Manually generating an error
session	MongoDB session
transaction	Safe database operation
And this is the most important thing:

When you're learning backend, don't read a controller as 30 individual lines of code.

Ask these 5 questions every time:

1. What data is coming INTO the controller?
           ↓
       req.body


2. What does the controller DO with that data?
           ↓
       validate
       hash
       database


3. What does it SAVE?
           ↓
       User document


4. What does it CREATE?
           ↓
       JWT token


5. What does it SEND BACK?
           ↓
       res.json()




Request/Response → Routes → Controllers → Models/Mongoose → Middleware → Authentication/JWT → Error handling → Transactions → Subscription business logic.

                    
                         
                         */