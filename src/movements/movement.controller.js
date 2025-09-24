import Movement from './movement.model.js'
import Product from '../products/product.model.js';
import User from '../users/user.model.js';

export const registerEntry = async (req, res) => {
    try {

        const { productId, quantity } = req.body;
        const product = req.product;
        const employee = req.usuario._id;

        product.stock += Number(quantity);
        await product.save();

        const movement = new Movement({
            product: productId,
            quantity,
            employee
        })
    
        await movement.save();

        return res.status(201).json({
            success: true,
            msg: 'Entry registered successfully',
            movement
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error registering entry',
            error: error.message
        })
    }
}

export const registerOutput = async (req, res) => {
    try {
        
        const { productId, quantity, reason, destiny } = req.body;
        const product = req.product;
        const employee = req.usuario._id;

        product.stock -= Number(quantity);
        product.sales += Number(quantity)
        await product.save();

        const movement = new Movement({
            product: productId,
            quantity: quantity,
            employee,
            reason,
            destiny
        })

        await movement.save();

        return res.status(201).json({
            success: true,
            msg: 'Output registered successfully',
            movement
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error registering output',
            error: error.message
        })
    }
}

export const getMovements = async (req, res) => {

    const query = { status: true };

    try {
        
        const movements = await Movement.find(query).sort({ date: -1 });

        const movementsWithEmployee = await Promise.all(movements.map(async (movement) => {
            const employee = await User.findById(movement.employee);
            const product = await Product.findById(movement.product);
            return {
                ...movement.toObject(),
                employee: employee ? { id: employee._id, name: employee.name } : 'Data not found',
                product: product ? { id: product._id, name: product.name } : 'Data not found'
            }
        }))

        const total = await Movement.countDocuments(query);
        
        return res.status(200).json({
            success: true,
            total,
            movements: movementsWithEmployee
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error getting movements',
            error: error.message
        })
    }
}

export const getMovementsInventory = async (req, res) => {
    try {

        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                msg: 'You did not provide dates in the query',
            })
        }

        const movements = await Movement.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        })
        .sort({ date: -1 })
        .populate('product', 'name')
        .populate('employee', 'name')

        const total = movements.length

        return res.status(200).json({
            success: true,
            msg: 'Inventory movements retrieved successfully',
            total,
            movements
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error getting movements inventory',
            error: error.message,
        })
    }
}

