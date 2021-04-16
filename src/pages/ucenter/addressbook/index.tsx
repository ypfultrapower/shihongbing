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

class AddressBook extends Component<SearchProps> {
  handleTabChange = (key: string) => {
    const { match } = this.props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'staffs':
        history.push(`${url}/staffs`);
        break;
      case 'orgs':
        history.push(`${url}/orgs`);
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
    return 'staffs';
  };

  render() {
    const tabList = [
      {
        key: 'staffs',
        tab: '员工',
      },
      {
        key: 'orgs',
        tab: '组织机构',
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
export default AddressBook;
