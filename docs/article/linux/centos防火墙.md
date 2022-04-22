::: tip 基于centos7
centos防火墙相关设置
:::

## 1、防火墙状态管理

```shell
# 查看默认防火墙状态
firewall-cmd --state 
# 开启防火墙命令：
systemctl start firewalld
# 重启防火墙命令：
systemctl restart firewalld
# 关闭防火墙命令
systemctl stop firewalld
# 安装Firewall命令：
yum install -y firewalld firewalld-config
# 开机启动
systemctl enable firewalld
# 禁止开机启动
systemctl disable firewalld
# 查看状态
systemctl status firewalld
```

## 2、防火墙关闭或者开启端口

```shell
# Firewall开启常见端口命令：
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --zone=public --add-port=443/tcp --permanent
firewall-cmd --zone=public --add-port=22/tcp --permanent
firewall-cmd --zone=public --add-port=21/tcp --permanent
firewall-cmd --zone=public --add-port=53/udp --permanent

# Firewall关闭常见端口命令：
firewall-cmd --zone=public --remove-port=80/tcp --permanent
firewall-cmd --zone=public --remove-port=443/tcp --permanent
firewall-cmd --zone=public --remove-port=22/tcp --permanent
firewall-cmd --zone=public --remove-port=21/tcp --permanent
firewall-cmd --zone=public --remove-port=53/udp --permanent

# 批量添加区间端口
firewall-cmd --zone=public --add-port=4400-4600/udp --permanent
firewall-cmd --zone=public --add-port=4400-4600/tcp --permanent

# 批量删除区间端口
firewall-cmd --zone=public --remove-port=4400-4600/udp --permanent
firewall-cmd --zone=public --remove-port=4400-4600/tcp --permanent
```

## 3、防火墙开放特点端口

```shell
# 针对某个 IP开放端口
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.142.166" port protocol="tcp" port="6379" accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.0.233" accept"

# 针对一个ip段访问
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="10.168.58.0/28" port  protocol="tcp" port="2181" accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.1.0/24" port protocol="tcp" port="9200" accept"

# 删除某个IP
firewall-cmd --permanent --remove-rich-rule="rule family="ipv4" source address="192.168.1.51" accept"
```

## 4、防火墙注意事项

```shell
# 操作后别忘了执行重载
firewall-cmd --reload

# 查看端口开启状态
firewall-cmd --query-port=9998/tcp

# 查看防火墙规则
firewall-cmd --list-all 
```