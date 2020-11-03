myOrderPage.buttonClick

- [x] orderAssistant.initial() cloud.orderService({serviceType=1})

  return {success, code: -1 other}

- [x] orderAssistant.create({orderId}) cloud.orderService({serviceTpe=2, orderId})

  return {success,  code:  -1 other -2 inconsistantStatus }

- [x] orderAssistant_creater.cancel() cloud.orderservive({serviceType=4, orderId,  status, userId})

  return {success, code: -1 other -2 inconsistantStatus -3 wrong user }

- [x] orderAssistant_creater.evaluate() cloud.orderService(serviceType = 3, orderId, score, comment，side)

  return {success, code;-1 other -2 inconsisitantStatus, -3 wrong user}

  

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
+ [x] ACCEPTED: startService,  paras:orderId, userId code:-1 other, -2 userWrong, -3, statusWrong
+ [x] startService的时候同时要生成confirmCode
+ [x] SERVING: finish, paras orderId, userId, confirmCode code: -1 other, -2 userWrong, -3 statusWrong, -4 confirmCode wrong, -5 codeErrCount exceeded 要创建相应的评价表项
+ [x] EVALUATING: evaluate 参数和错误参见上面creater的evaluate
+ [x] ACCEPTED, SERVING, CANCELING 的cancel 参数和错误参见creater的cancel
+ [x] orderService.evaluate加上用户验证
+ [x] SERVING: after finished, the server should be paied.
+ [x] CREATED: take的时候订单是在created-order，要移到active-order中



+ [x] orderAssistant_server getCreatedOrderList	para(limit, fromStart, _createdListRec) return(orderList, _createdListRec)
+ [ ] orderAssistant_server getUserOrderList para(limit, fromStart, _serverListRec, status, userId) return(orderList, _serverListRec)



+ [ ] takeOrder的时候需要填入mobile手机号（不用了，直接用用户的手机号，不过要提示一下）
+ [ ] takeOrder的时候需要收订金
+ [x] orderService server start的时候同时要生成confirmCode
+ [ ] orderStatus.SERVING的的时候creater要可以查看验证码（creater/orderCard buttonText)
+ [ ] ~~数据库创建orderConfirmCode表，在server start的时候创建，在server finish以及所有的进入orderStatus.CANCELED的时候删除~~
+ [x] 在order表中加入confirmCode域
+ [ ] creater orderCard在不同阶段点击按钮的功能实现
+ [ ] 潜在的一个问题，验证次数超过以后进入exception
+ [ ] 潜在的问题，保证balance的安全操作