import * as crypto from 'crypto-js';
import { environment } from "../../environments/environment";
export class CookiesService {
  
  static createCookie(name: string, value: string, days: number) {
    value = (name == 'storage' && value != '' ? CookiesService.spliceCookie(JSON.parse(value)) : value);
      let expires = "";
      let domain = environment.APP_EXTENSION;
      if (days) {
          let date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
      }
      value = CookiesService.encryt(value);
      document.cookie = name + "=" + value + expires + "; domain=" + domain + "; path=/";
  }
  static readCookie(name: String) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ')
        c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0)
        return CookiesService.decrypt(c.substring(nameEQ.length, c.length));
    }
    return null;
  }
  static spliceCookie(storage) {
    storage.user ? storage.user.location = '' : '';
    storage.company ? storage.company.name = '' : '';
    return JSON.stringify(storage);
  }
  static eraseCookie(name: string) {
    CookiesService.createCookie(name, "", -1);
  }

  static encryt(text) {
    return crypto.AES.encrypt(text, environment.SECRET);
  }
  static decrypt(text) {
    try {
      let bytes = crypto.AES.decrypt(text.toString(), environment.SECRET);
      return bytes.toString(crypto.enc.Utf8);
    }catch (err) {
      return text;
    }
  }
}
