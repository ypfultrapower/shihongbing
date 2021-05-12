import {
  Button,
  Card,
  DatePicker,
  Input,
  Form,
  Row,
  Col,
  Switch, Select, message
} from 'antd';
import { connect, Dispatch,history} from 'umi';
import React, {FC, useEffect, useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import IpMdalForm from "@/pages/handle/blockStrategy/edit/components/IpMdalForm";
import moment, {Moment} from "moment";
import RegMdalForm from "@/pages/handle/blockStrategy/edit/components/RegMdalForm";
import RegTableForm from "@/pages/handle/blockStrategy/edit/components/RegTableForm";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
  const tableData:Array<{}> =  new Array<{}>()
  if(item && item.level==="3" && item.command.length>0){
    for(let i = 0;i<item.command.length;i++){
      let element = {
        key:i+"",
        reg:item.command[i]
      };
      tableData.push(element)
    }
  }
  useEffect(() => {
    //编辑初始化表单
    if (editType==="edit") {
      form.setFieldsValue({
        ...item,
        command:tableData
      });
      if(item.validTime && item.validTime!=""){
        form.setFieldsValue({validTime:[moment(item.validTime.split("&")[0]),moment(item.validTime.split("&")[1])]})
      }
      if(item.enable==="true"){
        form.setFieldsValue({ enable: true })
      }else{
        form.setFieldsValue({ enable: false })
      }
      setSourceIpContent(item.sourceIp)
      setDestIpContent(item.destIp)
      setStrategyType(item.type)
      setLevel(item.level)
    }else{
      form.resetFields();
    }
  }, [history])

  const { submitting } = props;
  const [visible, setVisible] = useState(false);
  const [regModalVisible, setRegModalVisible] = useState(false);
  const [strategyType, setStrategyType] = useState("whitelist");
  const [level, setLevel] = useState("1");
  const[sourceIpContent,setSourceIpContent] = useState("");
  const[destIpContent,setDestIpContent] = useState("");
  const [ipType, setIpType] = useState("");
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
    if(values.validTime){
      let times: Moment[] = values.validTime;
      if(times.length ==2){
        let start = moment(times[0]).format('YYYY-MM-DD HH:mm:ss');
        let end = moment(times[1]).format('YYYY-MM-DD HH:mm:ss');
        values.validTime = start+"&"+end;
      }
    }else{
      values.validTime = "";
    }
    values.destIp = destIpContent
    values.sourceIp = sourceIpContent
    //操作策略没有源IP
    if(values.level ==="3"){
      //命令处理
      if(values.command.length>0){
        let commondArray:string[] = new Array();
        for(let i=0;i<values.command.length;i++){
          commondArray.push(values.command[i].reg)
        }
        values.command =  commondArray;
      }
    }
    dispatch({
      type: 'blockStrategy/submitForm',
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
    console.log('edit block strategy Failed:', errorInfo);
  };

  const hideIpModal = () => {
    setVisible(false);
  };
  const hideRegModal = () => {
    setRegModalVisible(false);
  };
  const showSourceIpModal=() =>{
    setIpType("sourceIp")
    setVisible(true);
  }

  const showDestIpModal=() =>{
    setIpType("destIp")
    setVisible(true);
  }
  return (
    <PageHeaderWrapper content={editType==="add"? "阻断策略添加":"阻断策略编辑"} title={false}>
      <Card bordered={false}>
        <Form.Provider
          onFormFinish={(name, { values, forms }) => {
            if (name === 'ipForm') {
              //const { basicForm } = forms;
              if(ipType ==="sourceIp"){
                let tempArray = sourceIpContent.split("\n");
                tempArray.push(values.ip);
                let ipContent = "";
                tempArray.forEach((value,index)=>{
                  if(value !=""){
                    ipContent = ipContent+value+"\n"
                  }
                })
                setSourceIpContent(ipContent);
              }else if(ipType === "destIp"){
                let tempArray = destIpContent.split("\n");
                tempArray.push(values.ip);
                let ipContent = "";
                tempArray.forEach((value,index)=>{
                  if(value !=""){
                    ipContent = ipContent+value+"\n"
                  }
                })
                setDestIpContent(ipContent);
              }
              setVisible(false);
            }
          }}
        >
          <Form
            hideRequiredMark
            style={{ marginTop: 8 }}
            form={form}
            name="basicForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              'action': ['warning', 'block']
            }}
          >
            <FormItem name="id" hidden/>
            <FormItem
              {...formItemLayout}
              label={"策略名称"}
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

            <FormItem
              {...formItemLayout}
              label={"策略类型"}
              name="type"
              initialValue={strategyType}
              rules={[
                {
                  required: true,
                  message: "策略类型不能为空",
                },
              ]}
            >
              <Select placeholder="请选择策略类型" onChange={(selectValue)=>{setStrategyType(selectValue as string)}} >
                <Option value="whitelist">白名单策略</Option>
                <Option value="blacklist">黑名单策略</Option>
              </Select>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={"策略级别"}
              name="level"
              initialValue={level}
              rules={[
                {
                  required: true,
                  message: "策略类型不能为空",
                },
              ]}
            >
              <Select placeholder="请选择策略级别" onChange={(selectValue)=>{setLevel(selectValue as string)}}>
                <Option value="1">一级</Option>
                <Option value="2">二级</Option>
                <Option value="3">三级</Option>
              </Select>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={"源IP"}
              name="sourceIp"
              help={"请输入单个IP,CIDR表达式IP,IP段,A段B段C段IP.IP表达式之间用分号分割,如:192.168.1.1;192.168.1.2。如不会填写可通过添加IP按钮进行IP添加。"}
            >
              <Row gutter={30}>
                <Col span={20}>
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder={"请输入源IP"}
                    rows={8}
                    value={sourceIpContent}
                    onChange={(e)=>{setSourceIpContent(e.target.value)}}
                  />
                </Col>

                <Col span={4}>
                  <Button htmlType="button" type={"primary"} onClick={showSourceIpModal}>添加IP</Button>
                </Col>
              </Row>
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={"目的IP"}
              name="destIp"
              help={"请输入单个IP,CIDR表达式IP,IP段,A段B段C段IP.IP表达式之间用分号分割,如:192.168.1.1;192.168.1.2。如不会填写可通过添加IP按钮进行IP添加。"}
            >
              <Row gutter={30}>
                <Col span={20}>
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder={"请输入目的IP"}
                    rows={8}
                    value={destIpContent}
                    onChange={(e)=>{setDestIpContent(e.target.value)}}
                  />
                </Col>

                <Col span={4}>
                  <Button htmlType="button" type={"primary"} onClick={showDestIpModal}>添加IP</Button>
                </Col>
              </Row>
            </FormItem>

            {Number(level)>=2 &&
              <FormItem
                {...formItemLayout}
                label={"帐号"}
                name="user"
                help="帐号之间用分号分割 如:root;sys;admin;oracle"
              >
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder={"请输入登录帐号,帐号之间用分号分割 如:root;sys;admin;oracle"}
                  rows={8}
                />
              </FormItem>
            }

            {Number(level)>=3 &&
            <FormItem
              {...formItemLayout}
              label={"正则命令"}
              name="command"
              help={"由于正则表达式的特殊性,请使用添加按钮进行封禁命令添加"}
            >
              <RegTableForm/>
            </FormItem>
            }

            <FormItem
              {...formItemLayout}
              label={"生效时间"}
              name="validTime"
            >
              <RangePicker
                showTime
                format={"YYYY-MM-DD HH:mm:ss"}
                style={{ width: '100%' }}
                placeholder={[
                  "开始时间",
                  "结束时间"
                ]}
              />
            </FormItem>

            <Form.Item {...formItemLayout}
              name="enable" label="是否启用" valuePropName="checked" initialValue={true} >
              <Switch  checkedChildren={'启用'} unCheckedChildren={'禁用'} />
            </Form.Item>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=>history.goBack()}>
                返回
              </Button>
            </FormItem>
          </Form>
          <IpMdalForm visible={visible} onCancel={hideIpModal} />
          <RegMdalForm visible={regModalVisible} onCancel={hideRegModal} />
        </Form.Provider>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['blockStrategy/submitForm'],
}))(BasicForm);
