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

class Warning extends Component<SearchProps> {
  handleTabChange = (key: string) => {
    const { match } = this.props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'agentWarning':
        history.push(`${url}/agentWarning`);
        break;
      case 'apiWarning':
        history.push(`${url}/apiWarning`);
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
    return 'agentAnalysis';
  };

  render() {
    const tabList = [
      {
        key: 'agentWarning',
        tab: 'agent端分析告警',
      },
      {
        key: 'apiWarning',
        tab: 'api端分析告警',
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
export default Warning;
