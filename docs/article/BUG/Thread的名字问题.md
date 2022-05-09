## 问题复现

```java
for (int i = 0; i < 100; i++) {
    new Thread(new OrderService()).start();
}

public class OrderService implements Runnable {
    private OrderNumGenerator orderNumGenerator = new OrderNumGenerator();
    // private Lock lock = new ReentrantLock();
    private Lock lock = new ZkLock();

    @Override
    public void run() {
        getNumber();
    }

    private void getNumber() {
        try {
            lock.getLock();
            // lock.lock();
            String number = orderNumGenerator.getNumber();
            System.out.println(Thread.currentThread().getName() + "，获取的number：" + number);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();
        }
    }
}
```

::: warning 输出
这里线程的名字已经超过100了，按理来说最大应该是100才对？
:::

## 解决

以下是thread的源码
```java
private static int threadInitNumber;
private static synchronized int nextThreadNum() {
    return threadInitNumber++;
}
```

因为OrderService类也继承了Runnable接口所有这个threadInitNumber变量被初始化了两次。:sweat_smile:
