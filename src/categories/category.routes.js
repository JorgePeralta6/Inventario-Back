import { Router } from "express";
import { check } from "express-validator";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { deleteCategory, getCategories, saveCategory, updateCategories } from "./category.controller.js";

const router = Router();

router.get("/", getCategories )

router.post(
    "/",
    [
        validateJWT,
        validateFields
    ],
    saveCategory
)

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "not is a valid ID").isMongoId(),
        validateFields
    ],
    updateCategories
)

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "not is a valid ID").isMongoId(),
        validateFields
    ],
    deleteCategory
)
export default router;