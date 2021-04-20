// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  base:'/ueba',
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          routes: [
            {
              path: '/',
              redirect: '/agent/access',
            },
            {
              path: '/dashboard',
              name: 'dashboard',
              icon: 'dashboard',
              routes: [
                {
                  name: 'analysis',
                  icon: 'smile',
                  path: '/dashboard/analysis',
                  component: './dashboard/analysis',
                  authority: ['ROLE_ADMIN'],
                },
                {
                  name: '4AAnalysis',
                  icon: 'smile',
                  path: '/dashboard/4AAnalysis',
                  component: './dashboard/analysis',
                  authority: ['ROLE_ADMIN'],
                },
                {
                  name: 'monitor',
                  icon: 'smile',
                  path: '/dashboard/monitor',
                  component: './dashboard/monitor',
                },
                {
                  name: 'workplace',
                  icon: 'smile',
                  path: '/dashboard/workplace',
                  component: './dashboard/workplace',
                },
              ],
            },
            {
              path: '/agent',
              name: 'AGENT管理',
              routes: [
                {
                  path: '/agent',
                  redirect: '/agent/access',
                },
                {
                  name: 'AGENT入网管理',
                  path: '/agent/access',
                  component: './agent/access',
                },
                {
                  name: 'AGENT在网管理',
                  path: '/agent/online',
                  component: './agent/online',
                },
                {
                  name: 'ServerKey管理',
                  path: '/agent/serverkey',
                  component: './agent/serverkey',
                }
              ],
            },
            {
              path: '/behavior',
              name: '行为管理',
              routes: [
                {
                  path: '/behavior',
                  redirect: '/behavior/session',
                },
                {
                  name: '会话管理',
                  path: '/behavior/session',
                  component: './behavior/session',
                }
              ],
            },
            {
              path: '/fort',
              name: '堡垒机管理',
              routes: [
                {
                  path: '/fort',
                  redirect: '/fort/fortlist',
                },
                {
                  name: '堡垒清单',
                  path: '/fort/fortlist',
                  component: './fort/fortlist',
                }
              ],
            },
            {
              path: '/handle',
              name: '处置管理',
              routes: [
                {
                  path: '/handle',
                  redirect: '/handle/blockStrategy',
                },
                {
                  name: '阻断策略管理',
                  path: '/handle/blockStrategy',
                  component: './handle/blockStrategy',
                },
                {
                  name: '阻断策略编辑',
                  path: '/handle/blockStrategy/edit',
                  component: './handle/blockStrategy/edit',
                },
                {
                  name: '阻断白名单',
                  path: '/handle/whitelist',
                  component: './handle/whitelist',
                  routes: [
                    {
                      path: '/handle/whitelist',
                      redirect: '/handle/whitelist/sourceIP',
                    },
                    //源IP白名单
                    {
                      name: 'sourceIP',
                      icon: 'smile',
                      path: '/handle/whitelist/sourceIP',
                      component: './handle/whitelist/sourceIP',
                    },
                    //目的IP白名单
                    {
                      name: 'destIP',
                      icon: 'smile',
                      path: '/handle/whitelist/destIP',
                      component: './handle/whitelist/destIP',
                    },
                    //登录账号白名单
                    {
                      name: 'account',
                      icon: 'smile',
                      path: '/handle/whitelist/account',
                      component: './handle/whitelist/account',
                    },
                    //自定义白名单
                    {
                      name: 'custom',
                      icon: 'smile',
                      path: '/handle/whitelist/custom',
                      component: './handle/whitelist/custom',
                    },
                    {
                      //自定义白名单编辑
                      path: '/handle/whitelist/custom/edit',
                      component: './handle/whitelist/custom/edit',
                    }
                  ]
                },
              ],
            },

            {
              path: '/userManage',
              name: 'userManage',
              routes: [
                {
                  path: '/userManage',
                  redirect: '/userManage/userInfo',
                },
                {
                  name: 'userInfo',
                  path: '/userManage/userInfo',
                  component: './userManage/userInfo',
                },
                {
                  name: 'userGroup',
                  path: '/userManage/userGroup',
                  component: './userManage/userGroup',
                }
              ],
            },
            {
              path: '/authorization',
              name: 'authorization',
              routes: [
                {
                  path: '/authorization',
                  redirect: '/authorization/menu',
                },
                {
                  name: 'menu',
                  path: '/authorization/menu',
                  component: './authorization/menu',
                },
                {
                  name: 'role',
                  path: '/authorization/role',
                  component: './authorization/role',
                }
              ],
            },
            {
              path: '/sys',
              name: 'sys',
              routes: [
                {
                  name: 'task',
                  path: '/sys/task',
                  component: './sys/task',
                }
              ],
            },
            {
              name: 'result',
              icon: 'CheckCircleOutlined',
              path: '/result',
              routes: [
                {
                  name: 'success',
                  icon: 'smile',
                  path: '/result/success',
                  component: './result/success',
                },
                {
                  name: 'fail',
                  icon: 'smile',
                  path: '/result/fail',
                  component: './result/fail',
                },
              ],
            },
            {
              name: 'exception',
              icon: 'warning',
              path: '/exception',
              routes: [
                {
                  name: '403',
                  icon: 'smile',
                  path: '/exception/403',
                  component: './exception/403',
                },
                {
                  name: '404',
                  icon: 'smile',
                  path: '/exception/404',
                  component: './exception/404',
                },
                {
                  name: '500',
                  icon: 'smile',
                  path: '/exception/500',
                  component: './exception/500',
                },
              ],
            },
            {
              name: 'account',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  name: 'center',
                  icon: 'smile',
                  path: '/account/center',
                  component: './account/center',
                },
                {
                  name: 'settings',
                  icon: 'smile',
                  path: '/account/settings',
                  component: './account/settings',
                },
              ],
            },
            {
              name: 'editor',
              icon: 'highlight',
              path: '/editor',
              routes: [
                {
                  name: 'flow',
                  icon: 'smile',
                  path: '/editor/flow',
                  component: './editor/flow',
                },
                {
                  name: 'mind',
                  icon: 'smile',
                  path: '/editor/mind',
                  component: './editor/mind',
                },
                {
                  name: 'koni',
                  icon: 'smile',
                  path: '/editor/koni',
                  component: './editor/koni',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
