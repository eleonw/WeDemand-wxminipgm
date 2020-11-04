以下的功能需要在以后进行完善

+ [ ] 潜在的一个问题，验证次数超过以后进入exception
+ [ ] 潜在的问题，保证balance的安全操作

+ [ ] 潜在的问题：将balance有关操作都放到balanceService中，如何保证在处理订单时balance和相应操作的同步问题？（没办法用事务了）
+ [ ] 潜在改进：将balanceChange分为initial和confirm两个阶段

