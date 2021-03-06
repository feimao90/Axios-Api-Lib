# Axios Api Library

English | [简体中文](./README-ZH.md)

API request Library Based on Axios

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Basic](#basic)
  * [Configure Axios](#configure-axios)
  * [Sample API Configuration](#sample-api-configuration)

## Install

```bash
$ npm i axios-api-lib

#or

$ yarn add axios-api-lib
```

## Usage

### Basic

**api.js**

```js
import { request } from 'axios-api-lib'

import user from './user'

request.use('user', user)

request.user.fetch()
```

**user.js**

```js
export default {
  fetch: 'http://example.com/users',
}
```

### Configure Axios

```js
import { http, request } from 'axios-api-lib'

// [Global axios defaults](https://github.com/axios/axios#global-axios-defaults)
http.defaults.baseURL = 'http://example.com'

// Interceptors request response
http.interceptors.request.use()

http.interceptors.response.use()

// Finally call request.setHttp method
let req = request.setHttp(http)

// set shake proof
let req = req.setConfig({ shake: 1 })

export { http, req }
```

### Sample API Configuration

**Configuration**

```js
// user.js
export default {
  // Get Request
  fetch: {
    url: 'users',
    method: 'get',
  }
  // Put Request and Dynamic URL
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
