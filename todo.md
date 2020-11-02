myOrderPage.buttonClick

- [x] orderAssistant.initial() cloud.orderService({serviceType=1})

  return {success, code: -1 other}

- [x] orderAssistant.create({orderId}) cloud.orderService({serviceTpe=2, orderId})

  return {success,  code:  -1 other -2 inconsistantStatus }

- [x] orderAssistant_creater.cancel() cloud.orderservive({serviceType=4, orderId,  status, userId})

  return {success, code: -1 other -2 inconsistantStatus }

- [x] orderAssistant_creater.evaluate() cloud.orderService(serviceType = 3, orderId, score, comment，side)

  return {success, code;-1 other -2 inconsisitantStatus}		错误都只实现了了-1

- [ ] ~~shareData.getOrderList(status, skip, limit),~~ orderAssistant.getOrderList(status(Array), _getListRec, limit)

  return {success, code:-1 other}

- [ ] myOrderPage.pay(cost) 

  return {success}

- [ ] paymentAssistant.payWithBalance()

- [ ] evaluateOrder.vue eventBus.$on('evaluateOrder', {success})



---

### 2020/11/2

---

+ [x] 把orderCard分成creater和server两个
+ [x] creater的orderCard取消showDetail参数
+ [x] server的orderCard设置showSensitive参数
+ [x] creater orderCard展示sensitiveInfo部分
+ [x] server orderCard展示sensitiveInfo部分
+ [x] 修改Order对象，加入sensitiveInfo域
+ [ ] server接单的时候也需要填写联系方式，联系方式要展示到orderCard上
+ [ ] 给Order增加getSensitiveInfoArray()(js有没有函数重写)
+ [ ] helpDeliver.vue加sensitiveInfo.main
+ [ ] helpBuy.vue sensitiveInfo.main
+ [ ] otherService.vue sensitiveInfo.main