# 部署
> 以下两种部署方式任选其一
## 1.使用dockerhub镜像部署
### pull镜像

```
docker pull cao19881125/tcp-forward-web:latest
```

### run

```
docker run -it -d --name 'ng1' --network host cao19881125/tcp-forward-web:latest
```


### 修改web服务端口和tcp-forward server地址
> 默认web服务使用的端口是7070，如果需要修改则执行
> 默认地址是用的http://localhost:8080/，如果不同则需要修改

```
docker cp ng1:/etc/nginx/nginx.conf ./
```
```
# vim docker/nginx.conf
server {
    listen       7070 default_server;
    ...
    location /tcp-forward-web/forward_server/{
                ...
                proxy_pass http://localhost:8080/;
                ...
            }
}
```
- 修改listen 后的端口值，即修改了web服务的地址
- 修改proxy_pass地址为tcp-forward server服务的地址


```
docker cp ./nginx.conf ng1:/etc/nginx/nginx.conf
```

```
docker restart ng1
```



## 2.编译部署
### 修改web服务端口和tcp-forward server地址
> 默认web服务使用的端口是7070，如果需要修改则执行
> 默认地址是用的http://localhost:8080/，如果不同则需要修改

```
docker cp ng1:/etc/nginx/nginx.conf ./
```
```
# vim docker/nginx.conf
server {
    listen       7070 default_server;
    ...
    location /tcp-forward-web/forward_server/{
                ...
                proxy_pass http://localhost:8080/;
                ...
            }
}
```
- 修改listen 后的端口值，即修改了web服务的地址
- 修改proxy_pass地址为tcp-forward server服务的地址

### build docker image

```
cd docker
./build.sh
```


```
# docker images
REPOSITORY                                                              TAG                 IMAGE ID            CREATED             SIZE
cao19881125/tcp-forward-web                                            latest              709c90d11224        8 minutes ago       145.4 MB
```

### run

```
docker run -it -d --name 'ng1' --network host cao19881125/tcp-forward-web:latest
```

# 访问
- 浏览器访问 http://ip:7070/
- 登录的用户名和密码在tcp-forward server的配置文件中配：https://github.com/cao19881125/tcp_forward