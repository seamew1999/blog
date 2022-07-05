## @Configuration注解

@Configuration这个注解可以加在类上，让这个类的功能等同于一个bean xml配置文件，如下：

```java
@Configuration
public class ConfigBean {

}
```

上面代码类似于下面的xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">

</beans>
```

通过AnnotationConfigApplicationContext来加载@Configuration修饰的类，如下：

```java
AnnotationConfigApplicationContext context = 
    new AnnotationConfigApplicationContext(ConfigBean.class);
```

此时ConfigBean类中没有任何内容，相当于一个空的xml配置文件，此时我们要在ConfigBean类中注册bean，那么我们就要用到@Bean注解了。

## @Bean注解

这个注解类似于bean xml配置文件中的bean元素，用来在spring容器中注册一个bean。

@Bean注解用在方法上，表示通过方法来定义一个bean，默认将方法名称作为bean名称，将方法返回值作为bean对象，注册到spring容器中。

```java
@Bean
public User user() {
    return new User();
}
```

## 加上@Configuration的@bean注解

测试一下

```java
@Test
void contextLoads() {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(ConfigBean.class);
    for (String beanName : context.getBeanDefinitionNames()) {
        String[] aliases = context.getAliases(beanName);
        System.out.printf("beanName:%s, alias:%s, beanObject:%s\n", beanName, Arrays.asList(aliases), context.getBean(beanName));
    }
}
```

输出

```java
beanName:org.springframework.context.annotation.internalConfigurationAnnotationProcessor, alias:[], beanObject:org.springframework.context.annotation.ConfigurationClassPostProcessor@2424686b
beanName:org.springframework.context.annotation.internalAutowiredAnnotationProcessor, alias:[], beanObject:org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor@6ea94d6a
beanName:org.springframework.context.annotation.internalCommonAnnotationProcessor, alias:[], beanObject:org.springframework.context.annotation.CommonAnnotationBeanPostProcessor@28486680
beanName:org.springframework.context.event.internalEventListenerProcessor, alias:[], beanObject:org.springframework.context.event.EventListenerMethodProcessor@4d7e7435
beanName:org.springframework.context.event.internalEventListenerFactory, alias:[], beanObject:org.springframework.context.event.DefaultEventListenerFactory@4a1e3ac1
beanName:configBean, alias:[], beanObject:com.seamew.config.ConfigBean$$EnhancerBySpringCGLIB$$42be403b@6e78fcf5
beanName:user, alias:[], beanObject:com.seamew.entity.User@56febdc
```

## 去掉@Configuration会怎样？

新建一个NoConfigBean类，内容和ConfigBean类一样，只是将@Configuration注解去掉了，如下：

```java
public class NoConfigBean {
    @Bean
    public User user() {
        return new User();
    }
}
```

输出

```java
beanName:org.springframework.context.annotation.internalConfigurationAnnotationProcessor, alias:[], beanObject:org.springframework.context.annotation.ConfigurationClassPostProcessor@6e78fcf5
beanName:org.springframework.context.annotation.internalAutowiredAnnotationProcessor, alias:[], beanObject:org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor@56febdc
beanName:org.springframework.context.annotation.internalCommonAnnotationProcessor, alias:[], beanObject:org.springframework.context.annotation.CommonAnnotationBeanPostProcessor@3b8ee898
beanName:org.springframework.context.event.internalEventListenerProcessor, alias:[], beanObject:org.springframework.context.event.EventListenerMethodProcessor@7d151a
beanName:org.springframework.context.event.internalEventListenerFactory, alias:[], beanObject:org.springframework.context.event.DefaultEventListenerFactory@294bdeb4
beanName:noConfigBean, alias:[], beanObject:com.seamew.config.NoConfigBean@5300f14a
beanName:user, alias:[], beanObject:com.seamew.entity.User@1f86099a
```

:::tip 上面两个输出对比得出
* 有没有@Configuration注解，@Bean都会起效，都会将@Bean修饰的方法作为bean注册到容器中
* 被@Configuration修饰的bean最后输出的时候带有EnhancerBySpringCGLIB的字样，而没有@Configuration注解的bean没有Cglib的字样；有EnhancerBySpringCGLIB字样的说明这个bean被cglib处理过的，变成了一个代理对象。
:::

## @Configuration加不加到底区别在哪？

首先需要定义两个类，test1和test2。

其中test1依赖于test2

* **test1**

```java
public class Test1 {
}
```

* **test2**

```java
public class Test2 {
    private Test1 test1;

    public Test2(Test1 test1) {
        this.test1 = test1;
    }

    @Override
    public String toString() {
        return "Test2{" +
                "test1=" + test1 +
                '}';
    }
}
```

* **ConfigBean**

```java
@Configuration
public class ConfigBean {
    @Bean
    public Test1 test1() {
        System.out.println("调用test1"); //@0
        return new Test1();
    }

    @Bean
    public Test2 test2() {
        System.out.println("调用test2");
        Test1 test1 = this.test1(); //@1
        return new Test2(test1);
    }

    @Bean
    public Test2 test3() {
        System.out.println("调用test3");
        Test1 test1 = this.test1(); //@2
        return new Test2(test1);
    }
}
```

输出结果

```java
调用test1
调用test2
调用test3
beanName:configBean, alias:[], beanObject:com.seamew.config.ConfigBean$$EnhancerBySpringCGLIB$$2bcb73e4@6e78fcf5
beanName:test1, alias:[], beanObject:com.seamew.entity.Test1@56febdc
beanName:test2, alias:[], beanObject:Test2{test1=com.seamew.entity.Test1@56febdc}
beanName:test3, alias:[], beanObject:Test2{test1=com.seamew.entity.Test1@56febdc}
```

* **NoConfigBean**

将上面的@Configuration注解去掉即可，代码的输出结果

```java
调用test1
调用test2
调用test1
调用test3
调用test1
beanName:noConfigBean, alias:[], beanObject:com.seamew.config.NoConfigBean@f2c488
beanName:test1, alias:[], beanObject:com.seamew.entity.Test1@54acff7d
beanName:test2, alias:[], beanObject:Test2{test1=com.seamew.entity.Test1@7bc9e6ab}
beanName:test3, alias:[], beanObject:Test2{test1=com.seamew.entity.Test1@5488b5c5}
```

## 总结

:::tip 由上面的两个实验可以看出
* 被@Configuration修饰的类，spring容器中会通过cglib给这个类创建一个代理，代理会拦截所有被@Bean修饰的方法，默认情况（bean为单例）下确保这些方法只被调用一次，从而确保这些bean是同一个bean，即单例的。
* 没有@Configuration修饰的类，就不是单例的创建，会默认创建到spring的根文件下，该bean是多例的
:::