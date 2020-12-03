const toString = Object.prototype.toString
/**
 * 判断target是否是对象
 * @param {*} target 验证目标对象
 * @return Boolean
 */
function isObject(target) {
  return toString.call(target) === '[object Object]'
}

/**
 * Verify that the target is an String Type
 * @param {*} target
 * @return Boolean
 */
function isString(target) {
  return toString.call(target) === '[object String]'
}

/**
 * Verify that the target is an Array type
 * @param {*} target
 * @return Boolean
 */
function isArray(target) {
  return toString.call(target) === '[object Array]'
}

/**
 * Verify that the target is an Empty Object
 * @param {*} target
 * @return Boolean
 */
function isEmptyObject(target) {
  if (isObject(target)) {
    return Object.keys(target).length === 0
  } else {
    throw new Error('Target is not an Object Type. But an Object type is excepted. ')
  }
}

function isDynamicUrl(url) {
  return /(:[a-zA-Z_]+)/.test(url)
}

function replaceDynamicUrl(url, params = {}) {
  return new Promise(resolve => {
    if (isEmptyObject(params)) {
      return resolve(['请设置动态替换的参数', ''])
    }
    const regexp = /(:[a-zA-Z_]+)/g
    const matches = url.match(regexp)
    if (matches !== null) {
      matches.forEach(match => {
        const value = params[match.replace(':', '')]
        if (value !== null && value !== undefined) {
          url = url.replace(match, value)
        } else {
          return resolve([`${match}参数没有匹配到值`, ''])
        }
      })
    }
    return resolve(['', url])
  })
}

module.exports = {
  isObject,
  isString,
  isArray,
  isEmptyObject,
  isDynamicUrl,
  replaceDynamicUrl,
}
