/*
 * localstorage封装
 * key命名规范：项目名 + 当前环境 + 项目版本 + 缓存key
 * express就是自己定义的过期时间,单位是毫秒，例如（12*60*60*1000），默认12小时
 * 使用crypto-js对缓存内容进行加密
 * */

interface dataObjType {
  [propName: string | number]: string | number | dataObjType;
}

interface objType {
  data: string | number | dataObjType;
  cTime: number;
  express: number;
}

let project = 'project';
let env = 'dev';
let version = '1.1';

// 引入crypto模块
import CryptoJS from './crypto.js';

class LocalStorage {
  constructor(protected express: number = 12 * 60 * 60 * 1000) {}
  set(key: string, value: string | number | dataObjType, express?: number) {
    let obj: objType = {
      data: value,
      cTime: Date.now(),
      express: express || this.express,
    };
    // 转换key
    let saveKey = `${project}_${env}_${version}_${key}`;
    // 转换value
    let saveValue = CryptoJS.encrypt(JSON.stringify(obj));
    localStorage.setItem(saveKey, saveValue);
  }
  get(key: string) {
    // 转换key
    let saveKey = `${project}_${env}_${version}_${key}`;
    let item = localStorage.getItem(saveKey);
    if (!item) {
      return null;
    }
    try {
      // 转换value
      let objItem = JSON.parse(CryptoJS.decrypt(item)) as objType;
      let nowTime = Date.now();
      if (objItem.express && objItem.express < nowTime - objItem.cTime) {
        this.remove(key);
        return null;
      }
      return objItem.data;
    } catch (e) {
      // this.set(key, null)
      return null;
    }
  }
  remove(key: string) {
    // 转换key
    let saveKey = `${project}_${env}_${version}_${key}`;
    localStorage.removeItem(saveKey);
  }
  // 移除所有的 localStorage 项
  clear() {
    localStorage.clear();
  }
}
export default new LocalStorage();
