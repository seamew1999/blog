## 三个线程轮流打印ABC，打印N次

### synchronized锁同步

```java
public void print(String str, int target) throws InterruptedException {
    for (int i = 0; i < n; i++) {
        synchronized (obj) {
            while (state % 3 != target) {
                try {
                    obj.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            state++;
            System.out.print(str);
            obj.notifyAll();
        }
    }
}
```

### lock锁同步

```java
public void print(String str, int target) throws InterruptedException {
    for (int i = 0; i < n; ) {
        try {
            lock.lock();
            while (state % 3 == target) {
                System.out.print(str);
                state++;
                i++;
            }
        } finally {
            lock.unlock();
        }
    }
}
```



