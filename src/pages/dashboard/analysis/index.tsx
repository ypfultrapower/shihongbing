import {EllipsisOutlined} from '@ant-design/icons';
import {Card, Col, Dropdown, Menu, Row} from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { RadioChangeEvent } from 'antd/es/radio';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import moment from 'moment';
import { connect, Dispatch } from 'umi';
import { getTimeDistance } from './utils/utils';
import { AnalysisData } from './data.d';
import styles from './style.less';
import {Icon} from "semantic-ui-react";
import BlockStrategyPie from "@/pages/dashboard/analysis/components/BlockStrategyPie";
import WarningColumn from "@/pages/dashboard/analysis/components/WarningColumn";
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

type RangePickerValue = RangePickerProps<moment.Moment>['value'];

interface AnalysisProps {
  dashboardAndanalysis: AnalysisData;
  dispatch: Dispatch;
  loading: boolean;
}

interface AnalysisState {
  salesType: 'all' | 'online' | 'stores';
  currentTabKey: string;
  rangePickerValue: RangePickerValue;
}

class Analysis extends Component<AnalysisProps, AnalysisState> {
  state: AnalysisState = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      //获取分析数据
      dispatch({
        type: 'dashboardAndanalysis/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndanalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = (e: RadioChangeEvent) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = (key: string) => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = (rangePickerValue: RangePickerValue) => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'dashboardAndanalysis/fetchSalesData',
    });
  };

  selectDate = (type: 'today' | 'week' | 'month' | 'year') => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'dashboardAndanalysis/fetchSalesData',
    });
  };

  isActive = (type: 'today' | 'week' | 'month' | 'year') => {
    const { rangePickerValue } = this.state;
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as moment.Moment, 'day') &&
      rangePickerValue[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const {salesType, currentTabKey } = this.state;
    const { dashboardAndanalysis, loading } = this.props;
    const {
      visitData2,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = dashboardAndanalysis;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <EllipsisOutlined />
        </Dropdown>
      </span>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
        <GridContent>
          <React.Fragment>
            <Row
              gutter={24}
              style={{
                marginTop: 24,
              }}
            >
              <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                <Card title={"Agent接入情况"} style={{height:"200px"}}>
                  <p><Icon color='red' name='computer' style={{paddingRight:"40px"}}/><strong>Agent入网数: </strong>{20}</p>
                  <p><Icon color='green' name='computer' style={{paddingRight:"40px"}}/><strong>Agent在线数: </strong>{20}</p>
                  <p><Icon color='green' name='percent' style={{paddingRight:"40px"}}/><strong>在线率: </strong>{"50%"}</p>
                </Card>
              </Col>

              <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                <Card title={"用户会话情况"} style={{height:"200px"}}>
                  <p><Icon color='blue' name='video' style={{paddingRight:"40px"}}/><strong>在线会话: </strong>{20}</p>
                  <p><Icon color='red' name='video' style={{paddingRight:"40px"}}/><strong>绕行会话: </strong>{20}</p>
                  <p><Icon color='green' name='percent' style={{paddingRight:"40px"}}/><strong>绕行率: </strong>{"50%"}</p>
                </Card>
              </Col>

              <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                <Card title={"阻断策略情况"} style={{height:"200px"}}>
                  <BlockStrategyPie/>
                </Card>
              </Col>

              <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                <Card title={"分析策略情况"} style={{height:"200px"}}>
                  <BlockStrategyPie/>
                </Card>
              </Col>
            </Row>


            <Row
              gutter={24}
              style={{
                marginTop: 24,
              }}
            >
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Card title={"近7天告警情况"}>
                  <WarningColumn/>
                </Card>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Card title={"近7天告警情况"}>
                  <WarningColumn/>
                </Card>
              </Col>
            </Row>

            <Row
              gutter={24}
              style={{
                marginTop: 24,
              }}
            >
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <TopSearch
                    loading={loading}
                    visitData2={visitData2}
                    searchData={searchData}
                    dropdownGroup={dropdownGroup}
                  />
                </Suspense>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <ProportionSales
                    dropdownGroup={dropdownGroup}
                    salesType={salesType}
                    loading={loading}
                    salesPieData={salesPieData}
                    handleChangeSalesType={this.handleChangeSalesType}
                  />
                </Suspense>
              </Col>
            </Row>
            <Suspense fallback={null}>
              <OfflineData
                activeKey={activeKey}
                loading={loading}
                offlineData={offlineData}
                offlineChartData={offlineChartData}
                handleTabChange={this.handleTabChange}
              />
            </Suspense>
          </React.Fragment>
        </GridContent>
    );
  }
}

export default connect(
  ({
    dashboardAndanalysis,
    loading,
  }: {
    dashboardAndanalysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    dashboardAndanalysis,
    loading: loading.effects['dashboardAndanalysis/fetch'],
  }),
)(Analysis);
