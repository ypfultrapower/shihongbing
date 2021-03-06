// 基础URl
export const BASE_URL = "http://localhost:8080";
//export const BASE_URL = "http://106.55.159.234:8080";
//客户端ID
export const CLIENT_ID = "ueba-ui";
//客户端密码
export const CLIENT_SECRET = "shb19881227";
export const AES_KEY = "N3U5dEhDc21mZDZReTFmSQ==";
export const AES_IV = "UG5FbzhCazUydkV0THp4Ng==";
export const ACCOUNT_REG = '^[a-zA-Z0-9_-]{4,16}$';
export const PWD_REG = '^.*(?=.{6,})(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!_@#$%^&*? ]).*$';
export const PHONE_REG = '^[1][3,4,5,6,7,8,9][0-9]{9}$';
export const IDCARD_REG = '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$';
export const EMAIL_REG = '^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$';
export const IP_REG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
export const IP_CIDR_REG = /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))\/([1-2][0-9]|3[0-2]|[1-9])$/;
export const IP_C_REG = /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){2}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))\/([cC])$/;
export const IP_B_REG =/^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.)((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))\/([bB])$/
export const IP_A_REG =/^((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))\/([a/A])$/;
export const IP_LAST_REG = /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))-(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))$/;
export const WEBSSH_SOCKETURL = "127.0.0.1:8080/webssh";

