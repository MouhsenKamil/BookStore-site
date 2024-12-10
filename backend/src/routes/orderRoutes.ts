import express from 'express'

import {
  getOrdersOfUser,
  getOrderById,
  updateOrder,
  // deleteOrder,
  cancelOrder
} from '../controllers/orderController.ts'
import { checkRequestAttrs } from '../middlewares/validators.ts'


const routeWithOrderId = express.Router({ mergeParams: true })

routeWithOrderId.use(checkRequestAttrs({obj: 'params', must: ['orderId']}))

routeWithOrderId.get('/', getOrderById)
routeWithOrderId.patch('/', updateOrder)
routeWithOrderId.delete('/', cancelOrder)
// routeWithOrderId.delete('/', deleteOrder)

const router = express.Router({ mergeParams: true })

router.get('/list', getOrdersOfUser)
router.use('/:orderId', routeWithOrderId)


export default router
