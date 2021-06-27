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

class AnalysisStrategy extends Component<SearchProps> {
  handleTabChange = (key: string) => {
    const { match } = this.props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'agentAnalysis':
        history.push(`${url}/agentAnalysis`);
        break;
      case 'apiAnalysis':
        history.push(`${url}/apiAnalysis`);
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
        key: 'agentAnalysis',
        tab: 'agent端分析策略',
      },
      {
        key: 'apiAnalysis',
        tab: 'api端分析策略',
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
export default AnalysisStrategy;
