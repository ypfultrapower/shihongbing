import { DefaultFooter, MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {SelectLang, useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import {Container, Grid, Dropdown,Image, Menu,Message,Segment} from "semantic-ui-react";
import logoSrc from "../assets/img/logo.png";
import styles from './UserLayout.less';
import 'semantic-ui-css/semantic.min.css';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  const defaultFooterDom = (
    <DefaultFooter
      copyright={`${new Date().getFullYear()} 神州泰岳Ultrapower Software.All right reserved`}
      links={[

      ]}
    />
  );
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          {/**Header**/}
          <Menu fixed='top' inverted>
            <Container>
              <Menu.Item as='a' header>
                <Image size='small' src={logoSrc} style={{ marginRight: '1.5em' }} />
                行为管理安全分析系统
              </Menu.Item>
              <Dropdown item simple text='快速链接'>
                <Dropdown.Menu>
                  <Dropdown.Item as={'a'} href="http://10.168.51.166:9090/iga/login_yn.html">新4A</Dropdown.Item>
                  <Dropdown.Item as={'a'} href="http://10.168.51.155:8080/iga/">用户中心</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Container>
          </Menu>

          <Container style={{ marginTop: '4em'}}>
            <Grid columns={2}>
              {/**友情提示框**/}
              <Grid.Column width={7}>
                <Message color='teal' style={{"borderRadius":"0px"}}>
                  <Message.Header>友情提示</Message.Header>
                  <Message.Content></Message.Content>
                  <Message.List>
                    <Message.Item>建议使用1280*800分辨率.</Message.Item>
                    <Message.Item>浏览器请使用谷歌、火狐,IE11,Edge</Message.Item>
                    <Message.Item>请尽量在本人机器上保存密码</Message.Item>
                    <Message.Item>第一次登录可能有点慢,请耐心等待!遇到问题请咨询:(qq:619869280) </Message.Item>
                  </Message.List>
                </Message>
              </Grid.Column>

              {/**登录框**/}
              <Grid.Column width={6}>
                <Segment padded size={'small'} style={{"borderRadius":"0px"}}>
                  {children}
                </Segment>
              </Grid.Column>
            </Grid>
          </Container>
        </div>
        {defaultFooterDom}
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
