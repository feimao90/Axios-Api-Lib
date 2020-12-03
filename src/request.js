const { isObject, isDynamicUrl, replaceDynamicUrl } = require('./utils')
const http = require('./http')
function Request() {
  this.target = null
  this.http = http
  this.config = {
    // 防抖开关
    shake: 1,
  }
}

/**
 * 覆盖默认的Axios
 * @param {Axios} http
 * @return Request
 */
Request.prototype.setHttp = function (http) {
  this.http = http
  return this
}

/**
 * 设置配置
 * @param {*} config
 * @return Request
 */
Request.prototype.setConfig = function (config) {
  this.config = { ...this.config, ...config }
  return this
}

/**
 * 将API模块注入到request中
 * @param {String} name Api模块的名称
 * @param {Object} config Api模块的配置
 * @example
 * const user = require('user')
 * request.use('user', user)
 *
 */
Request.prototype.use = function (name, configs) {
  const ob = (this[name] = {})
  // 保存当前API模块的配置
  ob.config = configs
  // 将所有带有URL参数的配置生成对应的请求方法
  Object.keys(configs).forEach(key => {
    const config = configs[key]
    if (typeof config === 'string') {
      ob[key] = this.send.bind(this, name, key, config, 'get', {})
    } else {
      const { url, method = 'get', ...options } = config
      if (!url) {
        return true
      }
      ob[key] = this.send.bind(this, name, key, url, method, options)
    }
    ob[key].state = 'readying'
  })
}

/**
 * send request method.
 * @param {String} module Api模块名称
 * @param {String} name Api方法名称
 * @param {String} url 请求地址
 * @param {String} method 请求方法
 * @param {Object} options Axios配置参数
 * @param {Object} args 用户自定义参数，会覆盖options中同名配置
 */
Request.prototype.send = async function (module, name, url, method, options, args = {}) {
  try {
    // 合并参数配置
    const config = { ...options, ...args }
    /**
     * method: 请求方法
     * params: 是即将与请求一起发送的 URL 参数
     * data: 作为主体发送的数据， 只适用于 PUT、POST、PATH, 详情查看axiso文档
     * bindName: 数据返回绑定vue组件的变量
     * otherOptions: Axios其他的参数配置
     */
    const {
      sUrl = url,
      sMethod = method,
      params = {},
      data = {},
      bindName = module,
      rules = {},
      ...otherOptions
    } = config

    // 通过method获取对应的参数列表
    const parameterList = sMethod === 'get' ? params : data

    // 替换动态参数，获取真实的URL
    const ul = await this.getUrl(sUrl, parameterList)

    return new Promise(resolve => {
      const request = () => {
        this.http({
          url: ul,
          method: sMethod,
          params,
          data,
          otherOptions,
        })
          .then(res => {
            resolve(['', res])
            this[module][name].state = 'readying'
          })
          .catch(err => {
            resolve([err])
            this[module][name].state = 'readying'
          })
      }

      if (this.config.shake) {
        if (this[module][name].state === 'readying') {
          this[module][name].state = 'waiting'
          // 发送请求
          request()
        } else {
          resolve([`[shake error] URL: ${url}`])
        }
      } else {
        request()
      }
    })
  } catch (error) {
    return new Promise(resolve => resolve([error.message, '']))
  }
}

Request.prototype.getUrl = async function (url, params) {
  if (isDynamicUrl(url)) {
    const [err, data] = await replaceDynamicUrl(url, params)
    if (err) {
      throw new Error(err)
    } else {
      return data
    }
  }
  return url
}

/**
 * request对象注入用户自定义对象
 * @param {*} target
 */
Request.prototype.bind = function (target) {
  isObject(target) && (this.target = target)
  return this
}

module.exports = new Request()
