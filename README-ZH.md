# Axios Api Library

[English](./README.md) | 简体中文

基于 Axios 二次封装的 Api 库

## 目录

- [安装](#安装)
- [使用说明](#使用说明)
  - [基本使用](#基本使用)
  * [Axios 配置](#Axios-配置)
  * [Api 模块配置](#Api-模块配置)

## Install

```bash
$ npm i axios-api-lib

#or

$ yarn add axios-api-lib
```

## 使用说明

### 基本使用

**api.js**

```js
import { request } from 'axios-api-lib'

// 导入user模块
import user from './user'

// 注入到request中
request.use('user', user)

// 接口调用方式
request.user.fetch()
```

**user.js**

```js
export default {
  fetch: 'http://example.com/users',
}
```

### Axios 配置

```js
import { http, request } from 'axios-api-lib'

// Axios全局配置 [参考地址](https://github.com/axios/axios#global-axios-defaults)
http.defaults.baseURL = 'http://example.com'

// Request拦截器  Response拦截器
http.interceptors.request.use()

http.interceptors.response.use()

// 调用request.setHttp设置请求库
// let req = request.setHttp(http)

// 开启防抖功能
// let req = req.setConfig({ shake: 1 })

// 链式调用
const req = request.setHttp(http).setConfig({ shake: 1 })

export { http, req }
```

### Api 模块配置

**Configuration**

```js
// user.js
export default {
  // Get请求
  fetch: {
    url: 'users',
    method: 'get',
  }
  // 动态URL
  update: {
    url: 'user/:id',
    method: 'put'
  }
}
```

**Invoking**

```js
const [err, data] = await api.user.fetch({ params: { page: 1, pageSize: 30 } })

const [err, data] = await api.user.update({ data: { id: 1, nickname: 'Tom' } })
```
