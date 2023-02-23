## 1、创建配置类

```java
@Configuration
public class DataSourceConfig {
    @Bean
    @ConfigurationProperties("spring.datasource.master")
    public DataSource masterDataSource() {
        return DruidDataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties("spring.datasource.slave01")
    @ConditionalOnProperty(prefix = "spring.datasource.slave01", name = "enabled", havingValue = "true")
    public DataSource slave01DataSource() {
        return DruidDataSourceBuilder.create().build();
    }

    @Bean
    @Primary
    public DynamicDataSource dataSource() {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        //配置默认数据源
        dynamicDataSource.setDefaultTargetDataSource(masterDataSource());
        //配置多数据源
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put(DataSourceType.MASTER.getSourceName(), masterDataSource());
        targetDataSources.put(DataSourceType.SLAVE01.getSourceName(), slave01DataSource());
        dynamicDataSource.setTargetDataSources(targetDataSources);
        return dynamicDataSource;
    }
}
```



## 2、配置yaml文件

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    # 主库数据源
    master:
      driver-class-name: com.mysql.jdbc.Driver
      url: jdbc:mysql://192.168.100.60:3306/demo?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
      username: root
      password: root
    # 从库数据源
    slave01:
      enabled: true
      driver-class-name: com.mysql.jdbc.Driver
      url: jdbc:mysql://192.168.100.60:3306/demo01?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
      username: root
      password: root
```

## 3、配置数据源切换

```java
public class DynamicDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceContextHolder.getDataSourceType();
    }
}
```

## 4、使用线程类切换数据源

```java
@Slf4j
public class DataSourceContextHolder {
    /**
     * 使用ThreadLocal维护变量，ThreadLocal为每个使用该变量的线程提供独立的变量副本，
     *  所以每一个线程都可以独立地改变自己的副本，而不会影响其它线程所对应的副本。
     */
    private static final ThreadLocal<String> CONTEXT_HOLDER = new ThreadLocal<>();

    /**
     * 设置数据源变量
     * @param dataSourceType
     */
    public static void setDataSourceType(String dataSourceType){
        log.info("切换到{}数据源", dataSourceType);
        CONTEXT_HOLDER.set(dataSourceType);
    }

    /**
     * 获取数据源变量
     * @return
     */
    public static String getDataSourceType(){
        return CONTEXT_HOLDER.get();
    }

    /**
     * 清空数据源变量
     */
    public static void clearDataSourceType(){
        CONTEXT_HOLDER.remove();
    }
}
```

## 5、多数据源的使用

```java
public List<User> findAll() {
    DataSourceContextHolder.setDataSourceType("slave01");
    List<User> users = userDao.findAll();
    DataSourceContextHolder.clearDataSourceType();
    return users;
}
```

## 6、DataSource源码

```java
protected DataSource determineTargetDataSource() {
    Assert.notNull(this.resolvedDataSources, "DataSource router not initialized");
    // 根据determineCurrentLookupKey函数返回map的key
    Object lookupKey = determineCurrentLookupKey();
    DataSource dataSource = this.resolvedDataSources.get(lookupKey);
    // 如果找的到key对应的value则使用其他数据源，要不然使用默认的
    if (dataSource == null && (this.lenientFallback || lookupKey == null)) {
        dataSource = this.resolvedDefaultDataSource;
    }
    if (dataSource == null) {
        throw new IllegalStateException("Cannot determine target DataSource for lookup key [" + lookupKey + "]");
    }
    return dataSource;
}
```

