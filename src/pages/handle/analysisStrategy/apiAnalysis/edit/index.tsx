import {
  Button,
  Card,
  Input,
  Form,
  Switch, message, Row, Col, Checkbox, Select
} from 'antd';
import { connect, Dispatch,history} from 'umi';
import React, {FC, useEffect, useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch;
}

const BasicForm: FC<BasicFormProps> = (props) => {
  //const { query = {} }  = props.history.location.query;
  const state = history.location.state;
  const editType = state.editType;
  const item = state.item;
  useEffect(() => {
    //编辑初始化表单
    form.setFieldsValue({
      ...item
    });
    if(item.action ==="2"){
      form.setFieldsValue({action:['0','1']})
    }else if(item.action ==="0"){
      form.setFieldsValue({action:['0']})
    }else if(item.action ==="1"){
      form.setFieldsValue({action:['1']})
    }
    if(item.enable==="true"){
      form.setFieldsValue({ enable: true })
    }else{
      form.setFieldsValue({ enable: false })
    }

    if(item.createBlockStrategy==="true"){
      form.setFieldsValue({ createBlockStrategy: true })
    }else{
      form.setFieldsValue({ createBlockStrategy: false })
    }
    setCategory(item.category)
  }, [history])

  const { submitting } = props;
  const [category, setCategory] = useState(undefined);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 10 },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  //表单提交
  const onFinish = (values: { [key: string]: any }) => {
    const { dispatch } = props;
    let actions:string[] = values.action;
    let action = actions.length ==1 ? actions[0]:"2";
    values.action = action;
    dispatch({
      type: 'analysisStrategy/submitForm',
      payload: {optType:editType,...values},
      callback:(res:any)=>{
        if(res.success){
          message.success(res.message);
          history.goBack();
        }else{
          message.error(res.message,5);
        }
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('edit analysis strategy Failed:', errorInfo);
  };

  return (
    <PageHeaderWrapper content="行为分析策略编辑" title={false}>
      <Card bordered={false}>
        <Form.Provider>
          <Form
            hideRequiredMark
            style={{ marginTop: 8 }}
            form={form}
            name="basicForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              'action': ['0', '1']
            }}
          >
            <FormItem name="id" hidden/>
            <FormItem
              {...formItemLayout}
              label={"分析策略名称"}
              name="name"
              rules={[
                {
                  required: true,
                  message: "策略名称不能为空",
                },
              ]}
            >
              <Input placeholder={"请输入策略名称"} />
            </FormItem>

            {category==="evliSource" &&
              <FormItem
                {...formItemLayout}
                label={"阈值"}
                name="threshold"
                help="源IP每天绕行的次数,达到该阈值表示恶意源"
                rules={[
                  {
                    required: true,
                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                    message: "请输入正确的数字",
                  },
                ]}
              >
                <Input placeholder={"请输入阈值"} />
              </FormItem>
            }

            {category==="lastAccount" &&
            <FormItem
              {...formItemLayout}
              label={"阈值"}
              name="threshold"
              help="帐号每小时触发普通告警的次数,达到该阈值表示帐号失陷"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[1-9]\d*$/, "g"),
                  message: "请输入正确的数字",
                },
              ]}
            >
              <Input placeholder={"请输入阈值"} />
            </FormItem>
            }


            <Form.Item {...formItemLayout}
                       name="enable" label="是否启用" valuePropName="checked" initialValue={true} >
              <Switch  checkedChildren={'启用'} unCheckedChildren={'禁用'} />
            </Form.Item>

            <Form.Item {...formItemLayout}
                       name="createBlockStrategy" label="是否自动创建封禁策略" valuePropName="checked" initialValue={true} >
              <Switch  checkedChildren={'是'} unCheckedChildren={'否'} />
            </Form.Item>


            <Form.Item {...formItemLayout}
                       name="action" label="策略动作">
              <Checkbox.Group  onChange={(checkedValue)=>{}}>
                <Row>
                  <Col span={20}>
                    <Checkbox value="1"  style={{ lineHeight: '32px' }}>告警</Checkbox>
                  </Col>

                  <Col span={20}>
                    <Checkbox value="0" style={{ lineHeight: '32px' }}>阻断</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <FormItem {...formItemLayout} name="warningLevel" label="告警级别">
              <Select style={{width:"50%"}}>
                <Option value="low">低危告警</Option>
                <Option value="middle">中危告警</Option>
                <Option value="high">高危告警</Option>
              </Select>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='描述'
              name="description"
            >
              <TextArea
                style={{ minHeight: 32 }}
                placeholder={'请输入描述信息'}
                rows={4}
              />
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=>history.goBack()}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Form.Provider>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['analysisStrategy/submitForm'],
}))(BasicForm);
