## 1、常用命令

### 1.1、镜像

```shell
vagrant box add CentOS-7.box --name centos7

vagrant box list

vagrant box remove box名	
```

### 1.2、虚拟机

```shell
# 初始化虚拟机配置文件
vagrant init boxname
# 根据当前目录下的Vagrantfile 启动虚拟机
vagrant up 
# 根据当前目录下的Vagrantfile 启动虚拟机,并执行provision里面的指令
# 因为里面的指令只有在第一次up 的时候会执行。
vagrant up --provision
# 根据当前目录下的Vagrantfile 进入虚拟机（交互模式）
vagrant ssh
# 根据当前目录下的Vagrantfile 暂停虚拟机
vagrant suspend
# 关机
vagrant halt
# 重新加载Vagrantfile，使之生效（相当于先 halt，再 up）
vagrant reload
# 根据当前目录下的Vagrantfile 重启虚拟机的时候执行Vagrantfile 里面的provision 的指令
# 默认是vagrant up 的时候启动一次
vagrant reload 一provision
# 执行Vagrantfile 里面的provision 的指令
vagrant provission
# 查看虚拟机状态
vagrant status 
# 启动虚拟机
vagrant up 
# 删除虚拟机
vagrant destroy 
```

### 1.3、启动

```shell
vagrant ssh
sudo -i
vi /etc/ssh/sshd_config
PasswordAuthentication yes
systemctl restart sshd
echo root|passwd --stdin root
```

### 1.4、扩容

```shell
# pvcreate命令不存在解决方案
yum -y install lvm2
```



[centos7根目录扩容（根目录在sda3 vgdisplay为空](https://blog.csdn.net/umufeng/article/details/120940916?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~Rate-3-120940916-blog-105744142.pc_relevant_antiscanv3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~Rate-3-120940916-blog-105744142.pc_relevant_antiscanv3&utm_relevant_index=6)

### 1.5、打包

```shell
# 查看虚拟机名称
vboxmanage list vms
vagrant package –-base [虚拟机名称] –-output [打包后的box名称]
```

## 2、配置文件

```shell
Vagrant.configure("2") do |config|
  # 设置虚拟机的主机名
  config.vm.hostname="k8s-node#{i}"
  # 设置主机与虚拟机的共享目录
  config.vm.synced_folder "~/Documents/vagrant/share", "/home/vagrant/share"

  config.vm.box = "centos7"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.disksize.size = '60GB'
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.name= "lab1"
    vb.cpus= 2
  end
end

```



## 附录

| 软件       | 官网                                                         |
| ---------- | ------------------------------------------------------------ |
| vagrant    | [Vagrant by HashiCorp (vagrantup.com)](https://www.vagrantup.com/) |
| VirtualBox | [Oracle VM VirtualBox](https://www.virtualbox.org/)          |
