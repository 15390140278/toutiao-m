// 封装本地存储操作模块

//  存储数据
export const setItem = (key, value) => {
  //  数组或对象转为JSON格式字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
//  获取数据
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  //  JSON格式的字符串不容易判断 所以使用try catch
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}
//  删除数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
