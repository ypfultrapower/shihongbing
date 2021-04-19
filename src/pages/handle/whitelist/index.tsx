import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';

interface SearchProps {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
}

class WhiteList extends Component<SearchProps> {
  handleTabChange = (key: string) => {
    const { match } = this.props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'sourceIP':
        history.push(`${url}/sourceIP`);
        break;
      case 'destIP':
        history.push(`${url}/destIP`);
        break;
      case 'account':
        history.push(`${url}/account`);
        break;
      case 'custom':
        history.push(`${url}/custom`);
        break;
      default:
        break;
    }
  };


  getTabKey = () => {
    const { match, location } = this.props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      return tabKey;
    }
    return 'sourceIP';
  };

  render() {
    const tabList = [
      {
        key: 'sourceIP',
        tab: '源IP白名单',
      },
      {
        key: 'destIP',
        tab: '目的IP白名单',
      },
      {
        key: 'account',
        tab: '登录账号白名单',
      },
      {
        key: 'custom',
        tab: '自定义白名单',
      }
    ];

    const { children } = this.props;
    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={this.getTabKey()}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}
export default WhiteList;
