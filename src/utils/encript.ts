const CryptoJS = require("crypto-js");
//aes加密
export function aesEncrypt(data:any, secretKey:any,iv:any) {
  const key = CryptoJS.enc.Base64.parse(secretKey)
  var iv =  CryptoJS.enc.Base64.parse(iv)
  const result = CryptoJS.AES.encrypt(data,key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return result.ciphertext.toString();
}
