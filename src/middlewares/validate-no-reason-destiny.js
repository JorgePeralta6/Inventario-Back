export const validateNoReasonAndDestiny = (req, res, next) => {

    const { destiny } = req.body;

    if ( destiny) {
        return res.status(400).json({
            success: false,
            msg: 'You cannot send this data: reason and destiny'
        })
    }
    next();

}