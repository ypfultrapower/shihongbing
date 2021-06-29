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
              name: 'behavior',
              routes: [
                {
                  path: '/behavior',
                  redirect: '/behavior/session',
                },
                {
                  name: 'session',
                  path: '/behavior/session',
                  component: './behavior/session',
                },
                {
                  name: 'blockedSession',
                  path: '/behavior/blockedSession',
                  component: './behavior/blockedSession',
                },
                {
                  name: 'schedule',
                  path: '/behavior/schedule',
                  component: './behavior/schedule',
                }
              ],
            },
            {
              path: '/fort',
              name: 'fort',
              routes: [
                {
                  path: '/fort',
                  redirect: '/fort/fortlist',
                },
                {
                  name: 'fortlist',
                  path: '/fort/fortlist',
                  component: './fort/fortlist',
                }
              ],
            },
            {
              path: '/handle',
              name: 'handle',
              routes: [
                {
                  path: '/handle',
                  redirect: '/handle/blockStrategy',
                },
                {
                  name: 'blockStrategy',
                  path: '/handle/blockStrategy',
                  component: './handle/blockStrategy',
                },
                {
                  name: 'blockStrategyEdit',
                  path: '/handle/blockStrategy/edit',
                  component: './handle/blockStrategy/edit',
                },
                {
                  name: 'analysisStrategy',
                  path: '/handle/analysisStrategy',
                  component: './handle/analysisStrategy',
                  routes: [
                    {
                      path: '/handle/analysisStrategy',
                      redirect: '/handle/analysisStrategy/agentAnalysis',
                    },
                    //agent端分析策略
                    {
                      name: 'agentAnalysis',
                      icon: 'smile',
                      path: '/handle/analysisStrategy/agentAnalysis',
                      component: './handle/analysisStrategy/agentAnalysis',
                    },
                    //agent端分析策略编辑
                    {
                      name: 'agentAnalysisEdit',
                      path: '/handle/analysisStrategy/agentAnalysis/edit',
                      component: './handle/analysisStrategy/agentAnalysis/edit',
                    },
                    //api端分析策略
                    {
                      name: 'apiAnalysis',
                      path: '/handle/analysisStrategy/apiAnalysis',
                      component: './handle/analysisStrategy/apiAnalysis',
                    },
                    //api端分析策略编辑
                    {
                      name: 'apiAnalysisEdit',
                      path: '/handle/analysisStrategy/apiAnalysis/edit',
                      component: './handle/analysisStrategy/apiAnalysis/edit',
                    },
                  ]
                },
              ],
            },

            {
              path: '/warning',
              name: 'warning',
              routes: [
                {
                  path: '/warning',
                  redirect: '/warning/warningShow',
                },
                {
                  name: 'warningShow',
                  path: '/warning/warningShow',
                  component: './warning/warningShow',
                }
              ],
            },
            {
              path: '/authorization',
              name: 'authorization',
              routes: [
                {
                  path: '/authorization',
                  redirect: '/authorization/user',
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
                },
                {
                  name: 'user',
                  path: '/authorization/user',
                  component: './authorization/user',
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
