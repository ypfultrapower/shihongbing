import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

export default (props:any) =>{
  const goback = ()=>{
    history.goBack();
  }
  const url = props.location.pathname;
  return(
    <Result
      status="404"
      title="404"
      style={{
        background: 'none',
      }}
      subTitle={`对不起，您访问的页面:${url}不存在`}
      extra={
        <Button type="primary" onClick={goback}>返回</Button>
      }
    />
  )};
