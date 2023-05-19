## kafka 的事务机制

Kafka 事务与数据库的事务定义基本类似，主要是一个原子性：**多个操作要么全部成功，要么全部失败**。Kafka 中的事务可以使应用程序将**消费消息、生产消息、提交消费位移**当作原子操作来处理。

- KAFKA的事务机制，在底层依赖于幂等生产者，幂等生产者是 kafka 事务的必要不充分条件；
- 事实上，开启 kafka事务时，kafka 会自动开启幂等生产者。

## kafka的幂等性

当 kafka producer 向 broker 中的 topic发送数据时，可能会因为网络抖动等各种原因，造成 producer 收不到 broker 的 ack 确认信息。kafka幂等性就会保证在生产者内部逻辑问题引起的消息重复消费的时候，只有一个数据可以被正确的发送。

::: tip 注意事项
如果使用try/catch捕获，用send手动发送，则会被视为不同的消息**
:::

**原理**

- 在 producer 端，每个 producer 都被 broker 自动分配了一个 Producer Id (PID)， producer 向 broker 发送的每条消息，在内部都附带着该 pid 和一个递增的 sequence number；
- 在 broker 端，broker 为每个 topic 的每个 partition 都维护了一个当前写成功的消息的最大 PID-Sequence Number 元组；
- 当 broker 收到一个比当前最大 PID-Sequence Number 元组小的 sequence number 消息时，就会丢弃该消息，以避免造成数据重复存储；
- 当 broker 失败重新选举新的 leader 时, 以上去重机制仍然有效：因为 broker 的 topic 中存储的消息体中附带了 PID-sequence number 信息，且 leader 的所有消息都会被复制到 followers 中。当某个原来的 follower 被选举为新的 leader 时，它内部的消息中已经存储了PID-sequence number 信息，也就可以执行消息去重了。

## kafka事务基本流程

* **initTransactions**：方法用来初始化事务，这个方法能够执行的前提是配置了transactionalId，如果没有则会报出IllegalStateException：
* **beginTransaction**：方法用来开启事务；
* **sendOffsetsToTransaction**：方法为消费者提供在事务内的位移提交的操作；将偏移量提交到事务中，仅当整个交易(消费和生产)成功时，它才会提交。
* **commitTransaction**：方法用来提交事务；
* **abortTransaction**：方法用来中止事务，类似于事务回滚。

```java
producer.initTransactions();
try {
    producer.beginTransaction();
    for (ProducerRecord<String, String> record : payload) {
        producer.send(record);
    }

    Map<TopicPartition, OffsetAndMetadata> groupCommit = new HashMap<TopicPartition, OffsetAndMetadata>() {
        {
            put(new TopicPartition(TOPIC, 0), new OffsetAndMetadata(42L, null));
        }
    };
    producer.sendOffsetsToTransaction(groupCommit, "groupId");
    producer.commitTransaction();
} catch (ProducerFencedException e) {
    producer.close();
} catch (KafkaException e) {
    producer.abortTransaction();
}
```

## 事务基本流程

1. **存储对应关系，通过请求增加分区**
   * Producer 在向新分区发送数据之前，首先向 TransactionalCoordinator 发送请求，使 TransactionalCoordinator 存储对应关系 (transactionalId, TopicPartition) 到主题 __transaction_state 中。
2. **生产者发送消息**
   * 基本与普通的发送消息相同，生产者调用 `producer.send()` 方法，发送数据到分区；
   * 发送的请求中，包含 pid, epoch, sequence number 字段；
3. **增加消费 offset 到事务**
   * 生产者通过 `producer.senOffsetsToTransaction()` 接口，发送分区的 Offset 信息到事务协调者，协调者将分区信息增加到事务中；
4. **事务提交位移**
   * 在前面生产者调用事务提交 offset 接口后，会发送一个 TxnOffsetCommitRequest 请求到消费组协调者，消费组协调者会把 offset 存储到 Kafka 内部主题 __consumer_offsets 中。协调者会根据请求的 pid 与 epoch 验证生产者是否允许发起这个请求。
   * 只有当事务提交之后，offset 才会对外可见。
5. **提交或回滚事务**
   * 用户调用 `producer.commitTransaction()` 或 `abortTransaction()` 方法，提交或回滚事务；
   * 生产者完成事务之后，客户端需要显式调用结束事务，或者回滚事务。前者使消息对消费者可见，后者使消息标记为 abort 状态，对消费者不可见。无论提交或者回滚，都会发送一个 EndTxnRequest 请求到事务协调者，同时写入 PREPARE_COMMIT 或者 PREPARE_ABORT 信息到事务记录日志中。

::: danger 需要注意的是
如果事务性生产者（Transactional Producer）发送的消息没有被提交，消费者是不会读取该消息之后的数据的。
:::