'use strict';
import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validate-cant-request.js';
import authRoutes from '../src/user-auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
import categoryRoutes from '../src/categories/category.routes.js'
import productRoutes from '../src/products/product.routes.js'
import movementRoutes from '../src/movements/movement.routes.js'
import { createCategory } from '../src/categories/category.controller.js';
import { createAdmin } from '../src/middlewares/creation-default-admin.js';
import { createRoles } from '../src/role/role.controller.js';

const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter)
}

const routes = (app) =>{
    app.use('/almacenadora/v1/auth', authRoutes);
    app.use('/almacenadora/v1/users', userRoutes);
    app.use('/almacenadora/v1/categories', categoryRoutes);
    app.use('/almacenadora/v1/products', productRoutes)
    app.use('/almacenadora/v1/movements', movementRoutes)
}

const conectarDB = async() =>{
    try {
        await dbConnection();
        console.log('Successful connection to the database')
    } catch (error) {
        console.log('Failed to connect to database')
    }
}

export const initServer = async() =>{
 const app = express();
 const port = process.env.PORT || 3000;
 try {
     middlewares(app);
     conectarDB();
     routes(app);
     app.listen(port);
     await createRoles();
     await createAdmin();
     await createCategory();
     console.log(`server running on port ${port}`)
    
 } catch (err) {
    console.log(`server init failed: ${err}`)
 }
}