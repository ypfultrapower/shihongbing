import { Result, Button } from 'antd';
import React from 'react';
import { history } from 'umi';
export default (props:any) => {
  const goback = ()=>{
    history.goBack();
  }
  const subTitle =  props.location.query.err ? props.location.query.err:'服务发生内部错误，请联系管理员!';
  return (
    <Result
    status="500"
    title="500"
    style={{
      background: 'none',
    }}
    subTitle={subTitle}
    extra={
      <Button type="primary" onClick={goback}>返回</Button>
    }
  />)
}

