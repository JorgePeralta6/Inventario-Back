import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { deleteProduct, getProduct, saveProduct, updateProduct, getProductStats,getProductSalesPercentage,getEarnings,getTopProduct,getTop3 } from "./product.controller.js";

const router = Router();

router.post(
    "/", 
    [
        validateJWT,
        validateFields
    ],
    saveProduct
)

router.get("/", getProduct)

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "not is a valid ID").isMongoId(),
        validateFields
        
    ],
    updateProduct
)

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "not a valid ID").isMongoId(),
        validateFields
    ],
    deleteProduct
)



router.get('/stats', getProductStats);

router.get('/percentage', getProductSalesPercentage);

router.get('/earnings', getEarnings);

router.get('/top', getTopProduct);

router.get('/top3', getTop3);

export default router