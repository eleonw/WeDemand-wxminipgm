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
+ [ ] server接单的时候也需要填写联系方式，联系方式要展示到orderCard上,相应地(Order构造函数和orderService.create要增加相关域)
+ [x] 给Order增加getSensitiveInfoArray()(js有没有函数重写)
+ [x] helpDeliver.vue加sensitiveInfo.main
+ [x] helpBuy.vue sensitiveInfo.main
+ [x] otherService.vue sensitiveInfo.main
+ [x] 修改creater的orderCard的按钮功能，并提供新的取消按钮
+ [x] 修改server的orderCard的按钮功能，并提供新的取消按钮
+ [x] 修改evaluate的状态为整数(evalStatus) -1:都未评价, 0:creater已评价, 1:server已评价, 2:评价完成(需要修改Order，orderService.evaluate orderService.initial)

server在不同阶段可以进行的操作：（修改server.js和orderService的index.js）

+ [x] CREATED: takeOrder	paras: orderId, userId, serverMobile  code: -1other, -2already taken away
+ [x] ACCEPTED: startService, cancel  paras:orderId, userId code:-1 other, -2 userWrong, -3, statusWrong
+ [ ] SERVING: finishService, cancel
+ [ ] EVALUATING: evaluate
+ [ ] CANCELING: passCancel



+ [ ] takeOrder的时候需要填入mobile手机号（不用了，直接用用户的手机号，不过要提示一下），还要收订金