export const validateCategory = async(req, res, next) => {
    const authenticatedUser = req.usuario.role;
    if(authenticatedUser != "ADMIN_ROLE"){
        return res.status(400).json({
            success: false,
            msg: "You don't have any autorization to modify category"
        })
    }
    next()
}