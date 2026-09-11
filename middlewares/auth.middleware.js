import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async (req, res, next) =>{       //this middleware is try to find the user from the token and attach it to the request object, so that the next middleware or controller can access the user information. If the token is invalid or missing, it will return a 401 Unauthorized response.
    try{
      let token;
      if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
      }
      if(!token)return res.status(401).json({ message: 'Unauthorized' });

      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await User.findById(decoded.userId);

      if(!user)return res.status(401).json({ message: 'Unauthorized' });

      req.user = user;
      next();

    } catch(error){
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

export default authorize;