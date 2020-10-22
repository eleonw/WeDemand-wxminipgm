myOrderPage.buttonClick

- [x] orderAssistant.initial() cloud.orderService({serviceType=1})

  return {success, code: -1 other}

- [x] orderAssistant.create({orderId}) cloud.orderService({serviceTpe=2, orderId})

  return {success,  code:  -1 other -2 inconsistantStatus }

- [x] orderAssistant_creater.cancel() cloud.orderservive({serviceType=4, orderId,  status, userId})

  return {success, code: -1 other -2 inconsistantStatus }

- [x] orderAssistant_creater.evaluate() cloud.orderService(serviceType = 3, orderId, score, comment，side)

  return {success, code;-1 other -2 inconsisitantStatus}		错误都只实现了了-1

- [ ] shareData.getOrderList(status, skip, limit), orderAssistant.getOrderList(status(Array), _getListRec, limit)

  return {success, code:-1 other}

- [ ] myOrderPage.pay(cost) 

  return {success}

- [ ] paymentAssistant.payWithBalance()

- [ ] evaluateOrder.vue eventBus.$on('evaluateOrder', {success})

