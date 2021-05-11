import {Alert, Checkbox} from 'antd';
import React, {useCallback, useEffect, useState} from 'react';
import { Dispatch, connect } from 'umi';
import { StateType } from './model';
import styles from './style.less';
import {getAesKey, LoginParamsType} from './service';
import LoginFrom from './components/Login';
import { CLIENT_ID, CLIENT_SECRET } from '../../../../config/systemConfig';
import {aesEncrypt} from "@/utils/encript";

const { Tab, UserName, Password, Mobile, Captcha, ImgCaptcha,Submit } = LoginFrom;
interface LoginProps {
  dispatch: Dispatch;
  userAndlogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userAndlogin = {}, submitting,dispatch } = props;
  const { status, type: grant_type } = userAndlogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('password');
  const [aesKey, setAesKey] = useState<string>('');
  const [aesIv, setAesIv] = useState<string>('');

  const fetchAesKeyAndIvFn = useCallback(()=>{
    getAesKey().then(res=>{
      if(res.success){
        setAesIv(res.data.aesIV);
        setAesKey(res.data.aesKey)
      }
    })
  },[]);
  useEffect(() => {
    fetchAesKeyAndIvFn()
  }, [localStorage.getItem("access_token")]);

  //登录
  const handleSubmit = (values: LoginParamsType) => {
    //后台使用oauth2实现的token，需要配置额外的认证参数
    let authParams:{} = {client_id:CLIENT_ID,client_secret:aesEncrypt(CLIENT_SECRET,aesKey,aesIv)};
    //认证参数转换
    for (let valuesKey in values) {
      if(valuesKey === "password"){
        authParams[valuesKey] = aesEncrypt(values[valuesKey],aesKey,aesIv);
      }else{
        authParams[valuesKey] = values[valuesKey];
      }
    }
    dispatch({
      type: 'userAndlogin/login',
      payload: {
        ...authParams,
        type,
      },
    });
  };
  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="password" tab="账户密码登录">
          {status === 'error' && grant_type === 'password' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="username"
            placeholder="请输入用户名"
            style={{width:"90%"}}
            rules={[
              {
                required: true,
                message: '用户名不能为空!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="请输入密码"
            style={{width:"90%"}}
            rules={[
              {
                required: true,
                message: '密码不能为空！',
              },
            ]}
          />
          <ImgCaptcha name="captcha"
                      placeholder="请输入验证码"
                      rules={[
                        {
                          required: true,
                          message: '验证码不能为空！',
                        },
                      ]}
          />
        </Tab>
        <Tab key="sms" tab="手机号登录">
          {status === 'error' && grant_type === 'sms' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            style={{width:"90%"}}
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText="获取验证码"
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
        <Submit loading={submitting}>登录</Submit>
        <div className={styles.other}>
          {/*<Link className={styles.register} to="/user/register">*/}
          {/*  注册账户*/}
          {/*</Link>*/}
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(
  ({
    userAndlogin,
    loading
  }: {
    userAndlogin: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      }
    };
  }) => ({
    userAndlogin,
    submitting: loading.effects['userAndlogin/login'],
  }),
)(Login);
