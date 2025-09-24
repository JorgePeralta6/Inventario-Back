export const validateQuantity = (req, res, next) => {

    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({
            success: false,
            msg: 'Quantity must be a positive number'
        })
    }
    next();
    
}