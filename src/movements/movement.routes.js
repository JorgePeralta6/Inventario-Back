import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { validateStock } from '../middlewares/validate-stock.js';
import { validateExists } from '../middlewares/validate-products.js';
import { validateReasonAndDestiny } from '../middlewares/validate-reason-destiny.js';
import { validateNoReasonAndDestiny } from '../middlewares/validate-no-reason-destiny.js';
import { validateQuantity } from '../middlewares/validate-quantity.js';
import { validateDates } from '../middlewares/validate-dates.js';
import { registerEntry, registerOutput, getMovements, getMovementsInventory, updateMovement} from './movement.controller.js';

const router = Router();

router.post(
    '/registerEntry',
    [
        validateJWT,
        validateExists,
        validateNoReasonAndDestiny,
        validateQuantity,
        check("id", "not a valid ID").isMongoId()
    ],
    registerEntry
)

router.post(
    '/registerOutput',
    [
        validateJWT,
        validateExists,
        validateReasonAndDestiny,
        validateStock,
        validateQuantity,
        check("id", "not a valid ID").isMongoId()
    ],
    registerOutput
)

router.get('/', getMovements)

router.get('/inventoryMovements',
    [
        validateDates
    ],
    getMovementsInventory
)

router.put('/:id', 
    [
        validateJWT
    ], 
    updateMovement
);

export default router;