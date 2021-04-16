import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { TableListItem } from '../data';

interface FormModal {
  visible: boolean;
  submitting:boolean;
  currentItem: Partial<TableListItem> | undefined;
  onSubmit: (values: TableListItem) => void;
  onCancel: () => void;
}

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const OperationModal: React.FC<FormModal> = (props) => {
  const [form] = Form.useForm();
  const { visible, currentItem, onCancel, onSubmit,submitting } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
    initTimeState();
  }, [props.visible]);

  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({
        ...currentItem
      });
      setCycle("customize")
    }
  }, [props.currentItem]);

  const initTimeState = ()=>{
    setDay("1");
    setHour("0");
    setMinute("0");
    setWeek("2");
  }

  //是否显示间隔周期表单元素
  const [cycle,setCycle] = useState<string>("customize");
  const [hour,setHour] = useState<string>("0");
  const [minute,setMinute] =  useState<string>("0");
  const [week,setWeek] =  useState<string>("2");
  const [day,setDay] =  useState<string>("1");
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 5 },
      md: { span: 10 },
    },
  };

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      let cronExpress = "";
      //间隔时间计算
      if(cycle === "everyDay"){
        cronExpress = "0 minute hour * * ?";
        values.cronExpress =  cronExpress.replace("minute",minute).replace("hour",hour);
      }else if(cycle === "everyHour"){
        cronExpress = "0 minute * * * ?";
        values.cronExpress =  cronExpress.replace("minute",minute);
      }else if(cycle === "everyMinute"){
        cronExpress = "0 */minute * * * ?";
        values.cronExpress =  cronExpress.replace("minute",minute);
      }else if(cycle === "everyWeek"){
        cronExpress = "0 minute hour ? * week";
        values.cronExpress =  cronExpress.replace("minute",minute).replace("hour",hour).replace("week",week);
      }else if(cycle==="everyMonth"){
        cronExpress = "0 minute hour day * ?";
        values.cronExpress =  cronExpress.replace("minute",minute).replace("hour",hour).replace("day",day);
      }
      onSubmit(values as TableListItem);
    }
  };

  const getCronContent = (cycle:string) => {
    if(cycle === "everyDay"){
      return (<FormItem {...formItemLayout} label="执行时刻">
        <Row gutter={30}>
          <Col span={8}>
            <Input type={'number'} value={hour} min={0} max={23} defaultValue={0} addonAfter={"小时"} onChange={event => {
              setHour(event.target.value);
            }}/>
          </Col>
          <Col span={8}>
            <Input type={'number'} value={minute} min={0} max={59} defaultValue={0} addonAfter={"分钟"} onChange={event => {
              setMinute(event.target.value);
            }}/>
          </Col>
        </Row>
      </FormItem>)
    }else if(cycle === "everyHour"){
      return (<FormItem {...formItemLayout} label="执行时刻">
        <Row gutter={30}>
          <Col span={8}>
            <Input type={'number'} value={minute} min={0} max={59} defaultValue={0} addonAfter={"分钟"} onChange={event => {
              setMinute(event.target.value);
            }}/>
          </Col>
        </Row>
      </FormItem>)
    }else if(cycle === "everyMinute"){
      return (<FormItem {...formItemLayout} label="执行时刻">
        <Row gutter={30}>
          <Col span={8}>
            <Input type={'number'} value={minute} min={0} max={59} defaultValue={0} addonAfter={"分钟"} onChange={event => {
              setMinute(event.target.value);
            }}/>
          </Col>
        </Row>
      </FormItem>)
    }else if(cycle === "everyWeek"){
      return (<FormItem {...formItemLayout} label="执行时刻">
        <Row gutter={30}>
          <Col span={8}>
            <Select defaultValue="2" onSelect={value => setWeek(value)} value={week}>
              <Option value="2">星期一</Option>
              <Option value="3">星期二</Option>
              <Option value="4">星期三</Option>
              <Option value="5">星期四</Option>
              <Option value="6">星期五</Option>
              <Option value="7">星期六</Option>
              <Option value="1">星期天</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Input type={'number'} value={hour} min={0} max={23} defaultValue={0} addonAfter={"小时"} onChange={event => {
              setHour(event.target.value);
            }}/>
          </Col>
          <Col span={8}>
            <Input type={'number'} value={minute} min={0} max={59} defaultValue={0} addonAfter={"分钟"} onChange={event => {
              setMinute(event.target.value);
            }}/>
          </Col>
        </Row>
      </FormItem>)
    }else if(cycle === "everyMonth"){
      return  (<FormItem {...formItemLayout} label="执行时刻">
        <Row gutter={30}>
          <Col span={8}>
            <Input type={'number'} value={day} min={1} max={31}  defaultValue={3} addonAfter={"日"} onChange={event => {
              setDay(event.target.value);
            }}/>
          </Col>
          <Col span={8}>
            <Input type={'number'} value={hour} min={0} max={23} defaultValue={0} addonAfter={"小时"} onChange={event => {
              setHour(event.target.value);
            }}/>
          </Col>
          <Col span={8}>
            <Input type={'number'} value={minute} min={0} max={59} defaultValue={0} addonAfter={"分钟"} onChange={event => {
              setMinute(event.target.value);
            }}/>
          </Col>
        </Row>
      </FormItem>)
    }
      return ( <FormItem
        {...formItemLayout}
        label='cron表达式'
        hasFeedback={true}
        name="cronExpress"
        rules={[
          {
            required: true,
            message: '计划任务表达式不能为空',
          },
        ]}
      >
        <Input placeholder='请输入计划任务表达式' />
      </FormItem>)
  }

  const getModalContent = () => {

    return (
      <Form form={form}
            name="taskForm"
            onFinishFailed={onFinishFailed} onFinish={handleFinish}>

        <FormItem name="group" initialValue={'sysTask'} hidden/>
        <FormItem
          {...formItemLayout}
          label='任务名称'
          hasFeedback={true}
          name="name"
          rules={[
            {
              required: true,
              message: '任务名称不能为空',
            },
          ]}
        >
          <Input placeholder='请输入任务名称' />
        </FormItem>


        <FormItem
          {...formItemLayout}
          label='任务类别'
          hasFeedback={true}
          name="className"
          initialValue={'com.ultrapower.ueba.task.AgentRunningStatusCheck'}
          rules={[
            {
              required: true,
              message: '任务类别不能为空',
            },
          ]}
        >
          <Select placeholder="请选择任务类别">
            <Option value="com.ultrapower.ueba.task.AgentRunningStatusCheck">Agent运行状态检测任务</Option>
          </Select>
        </FormItem>

        <FormItem {...formItemLayout} label="执行周期"
                  name="cycle"
                  initialValue="customize"
                  hasFeedback={true}
                  rules={[
                    {
                      required: true,
                      message: '执行周期不能为空',
                    },
                  ]}
        >
          <Select placeholder="请选择执行周期" value={cycle} onChange={value => {
            setCycle( value as string);
            initTimeState();
          }}>
            <Option value="everyDay">每天</Option>
            <Option value="everyHour">每小时</Option>
            <Option value="everyMinute">每分钟</Option>
            <Option value="everyWeek">每星期</Option>
            <Option value="everyMonth">每月</Option>
            <Option value="customize">自定义cron表达式</Option>
          </Select>
        </FormItem>

        {getCronContent(cycle)}

        <FormItem
          {...formItemLayout}
          label='任务描述'
          name="description"
        >
          <TextArea
            style={{ minHeight: 32 }}
            placeholder={'请输入任务描述'}
            rows={4}
          />
        </FormItem>

        {/*<FormItem {...submitFormLayout} style={{ marginTop: 32 }}>*/}
        {/*  <Button type="primary" htmlType="submit" loading={submitting}>提交</Button>*/}
        {/*  <Button htmlType='button' onClick={onRest}>重置</Button>*/}
        {/*</FormItem>*/}
      </Form>
    );
  };

  // const onFinish = async ()=>{
  //   const values = await form.validateFields();
  //   const { dispatch } = props;
  //   //间隔时间计算
  //   if("hour" === intervalUnit){
  //     values.intervalSeconds =  values.intervalSeconds*60*60;
  //   }else{
  //     values.intervalSeconds =  values.intervalSeconds*60;
  //   }
  //   dispatch({
  //     type: 'smapSynTask/addTask',
  //     payload: values,
  //   })
  // }

  //表单验证成功 提交表单
  // const onFinish = (values: { [key: string]: any }) => {
  //   const { dispatch } = props;
  //   //间隔时间计算
  //   if("hour" === intervalUnit){
  //     values.intervalSeconds =  values.intervalSeconds*60*60;
  //   }else{
  //     values.intervalSeconds =  values.intervalSeconds*60;
  //   }
  //   dispatch({
  //     type: 'smapSynTask/addTask',
  //     payload: values,
  //   })
  // };

  //表单验证失败
  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };



  //表单重置
  // const onRest = ()=>{
  //   form.resetFields();
  // }
  return (
    <Modal
      title={`任务${currentItem ? '编辑' : '添加'}`}
      width={1000}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      onCancel={onCancel}
      visible={visible}
      footer={[<Button key="submit" type="primary" onClick={handleSubmit} htmlType="submit" loading={submitting}>提交</Button>,
        <Button key="cancel" htmlType="button" onClick={onCancel}>取消</Button>]}
    >
      {getModalContent()}
    </Modal>
  );
};
export default OperationModal;

