## get请求

::: tip get的含义
get意为检索，获取。
:::

1. `@PathVariable`：当请求路径格式为`http://ip:port/projectName/aaaaa/{xx}`,在方法的`@RequestMapping`注解里面写上`@RequestMapping("user/{id}")`，表示的是 请求的最后一个字符就是id的值，在方法参数里我们用`@PathVariable`注解取值。
```java
@RequestMapping("user/{id}")
public String selectById(@PathVariable(name = "id") String id){
    System.out.println("参数id="+id);
    return "selectById请求成功";
}
```

2. `@RequestParam`：当请求路径格式为`http://ip:port/projectName/aaaaa?id=10086`,时，在方法参数里我们用`@RequestParam`注解取值。
```java
@RequestMapping("selectById")
public String selectById2(@RequestParam(name = "id") String id){
    System.out.println("参数id="+id);
    return "selectById2请求成功";
}
```

3. `@PathVariable` + `@RequestParam`组合使用
```java
@RequestMapping("selectUser/{id}")
public String selectByIdAndName(@PathVariable(name = "id") String id,
                                @RequestParam(name = "name") String name){
    System.out.println("参数id="+id);
    System.out.println("参数name="+name);
    return "selectByIdAndName请求成功";
}
```

4. 不加任何注解的时候，如果用?传值，直接在方法参数里使用相同变量名接收就行。
```java
@RequestMapping("selectUser2")
public String selectByIdAndName2(String id, String name){
    System.out.println("参数id="+id);
    System.out.println("参数name="+name);
    return "selectByIdAndName2请求成功";
}
```

## post请求

::: tip post的含义
post意为更新。
:::

先定义一个实体对象类SysUser
```java
@Data
public class SysUser {
    private String id;
    private String username;
    private String password;
    private Date birthday;
    private String email;
}
```

1. post请求，参数格式是json，使用`@RequestBody`注解然后直接用对象接收参数，这种前台一般是ajax请求。
```java
@PostMapping(path = "/addUser")
public String addUser(@RequestBody SysUser sysUser) {
    System.out.println(sysUser.toString());
    return "addUser请求成功";
}
```

2. post请求，参数格式是表单数据，在postman里面就是form-data格式。
```java
@PostMapping(path = "/addUser2")
public String addUser2(SysUser sysUser) {
    System.out.println(sysUser.toString());
    return "addUser2请求成功";
}
```

::: danger 注意
- `json`格式传递日期类型的时候使用`YYYY-MM-DD`，例如`2019-09-09`
- 表单`（form-data格式）`传递日期类型的时候使用`YYYY/MM/DD`，例如`2019/08/08`
- 这个是我们没有使用formate的情况，使用formate的话就根据自定义类型传递就可以了。
- spring boot如果不加任何注解默认使用x-www-form-urlencoded类型
:::

3. 万能的map
```java
@PostMapping("/addUser4")
public String addUser4(@RequestParam Map<String, Object> map) {
    System.out.println(">>>id="+map.get("id"));
    System.out.println(">>>name="+map.get("name"));
    return "addUser4请求成功";
}
```
::: warning x-www-form-urlencoded与params的区别
- `Params`处设置的变量请求时会变成`http://********?*******`问号后面的参数带到请求的接口链接里。
- `x-www-form-urlencoded`的参数则会放入到请求体的body中不会显式地出现在请求URL中。
- `post`也可以使用`params`的方式传参，但是为了体现他与`get`的区别我们默认使用`x-www-form-urlencoded`格式就行。
:::

## header以及Cookie

1. 使用`@RequestHeader`和`@CookieValue`获取请求头和cookie的信息
```java
@GetMapping("getCookieAndHeader")
public String getCookieAndHeader(@RequestHeader(name = "myHeader") String myHeader,
                  @CookieValue(name = "myCookie") String myCookie) {
    System.out.println("myHeader=" + myHeader);
    System.out.println("myCookie=" + myCookie);
    return "getCookieAndHeader请求成功";
}
```

2. 通过`request`获取`header`和`cookie`
```java
@GetMapping("/getCookieAndHeader2")
public String getCookieAndHeader2(HttpServletRequest request) {
    System.out.println("myHeader=" + request.getHeader("myHeader"));
    for (Cookie cookie : request.getCookies()) {
        if ("myCookie".equals(cookie.getName())) {
            System.out.println("myCookie=" + cookie.getValue());
        }
    }
    return "getCookieAndHeader2请求成功";
}
```

3. 通过`request`获取普通参数，`post`和`get`方法都可以获取到
```java
@RequestMapping("/addUser3")
public String addUser3(HttpServletRequest request) {
    String username=request.getParameter("username");
    String password=request.getParameter("password");
    System.out.println("username = "+username);
    System.out.println("password = "+password);
    return "addUser3请求成功";
}
```

## x-www-form-urlencoded与form-data的区别

### x-www-form-urlencoded

- 最常见的`POST`提交数据的方式了。浏览器的原生`<form>`表单，如果不设置`enctype`属性，那么最终就会以`application/x-www-form-urlencoded`方式提交数据。
- 只能上传键值对，而且键值对都是通过&间隔分开的。

### form-data

- 将每个`kay-value`分割为一个`message`，每个message可以传输二进制数据。
- 每个`message`被边界分隔符分割，使用base64编码解决分隔符不能包含在原始的二进制文件中的问题。

::: tip form-data和x-www-form-urlencoded我们使用那个？
- 对于较短的字母数字值（如大多数 Web 表单），添加所有`MIME`标头的开销将大大超过更有效的二进制编码所节省的成本。
- 只有键值对来传输的时候我们选择`x-www-form-urlencoded`
- 当有二进制文件需要传输的时候我们选择`form-data`
- 当只有一个二进制文件需要传输我们选择`binary`
:::

本章节参考链接：[application/x-www-form-urlencoded or multipart/form-data?](https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data)