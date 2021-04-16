/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
  SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, useIntl, connect, Dispatch, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import {
  HomeOutlined,
  PicLeftOutlined,
  SmileOutlined,
  SettingOutlined,
  DashboardOutlined,
  FormOutlined,
  UserOutlined,
  SafetyOutlined,
  ClusterOutlined,
  FileOutlined, MonitorOutlined, AuditOutlined, LinkOutlined, AlertOutlined
} from '@ant-design/icons';
import 'semantic-ui-css/semantic.min.css';
import './../global.less'

const iconEnum = {
  smile: <SmileOutlined />,
  home: <HomeOutlined />,
  picLeft: <PicLeftOutlined />,
  setting: <SettingOutlined />,
  dashboard:<DashboardOutlined/>,
  user:<UserOutlined />,
  form:<FormOutlined/>,
  authorization:<SafetyOutlined/>,
  ClusterOutlined:<ClusterOutlined/>,
  FileOutlined:<FileOutlined/>,
  MonitorOutlined:<MonitorOutlined/>,
  AuditOutlined:<AuditOutlined/>,
  LinkOutlined:<LinkOutlined/>,
  AlertOutlined:<AlertOutlined/>
};
const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    //索引类型
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    let localIcon : React.ReactText = item.icon as React.ReactText;
    const localItem = { ...item, icon:iconEnum[localIcon], children: item.children ? menuDataRender(item.children) : [] };
    let result :MenuDataItem =  Authorized.check(item.authority, localItem, null) as MenuDataItem;
    return result;
  });
const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 神州泰岳Ultrapower Software.All right reserved`}
    links={[

    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    menuData,
    location = {
      pathname: '/',
    },
  } = props;
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  useEffect(() => {
    if(dispatch){
      /** 重点：useEffect 相当于生命周期函数componentDidMount
       自己再user.ts 中添加一个方法fetchMenu 用来获取服务器传过来菜单列表
       */
      dispatch({
        type: 'user/fetchMenus',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  return (
    <>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={()=>menuDataRender(menuData as MenuDataItem[])}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(({ global,settings,user}: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  menuData: user.currentUserMenus
}))(BasicLayout);
