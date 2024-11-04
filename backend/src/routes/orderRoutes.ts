import express from 'express'
import {
  getOrdersOfUser,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder
} from '../controllers/orderController.ts'
import { checkRequestAttrs } from '../middlewares/validators.ts'


const routeWithOrderId = express.Router()

routeWithOrderId.use(checkRequestAttrs({obj: 'params', must :['orderId']}))

routeWithOrderId.get('/', getOrderById)
routeWithOrderId.patch('/', updateOrderStatus)
routeWithOrderId.patch('/cancel', cancelOrder)
routeWithOrderId.delete('/', deleteOrder)

const router = express.Router()

router.get('/list', getOrdersOfUser)
router.use(routeWithOrderId)


export default router
