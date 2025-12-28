const express = require('express')
const OrderRoutes = require('./routes/order.routes')

module.exports = () => {
  const router = express.Router()
    
  // Agrupa todas as rotas do domínio Order
  router.use('/orders', OrderRoutes())

  return {
    orderRoutes: router
  }
}