import {
  Button,
  Card,
  DatePicker,
  Input,
  Form,
  Row,
  Col,
  message
} from 'antd';
import { connect, Dispatch,history} from 'umi';
import React, {FC, useEffect, useState} from 'react';
import moment, {Moment} from "moment";
import IpMdalForm from "@/pages/handle/whitelist/custom/edit/components/IpMdalForm";
import RegTableForm from "@/pages/handle/whitelist/custom/edit/components/RegTableForm";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch;
}

const BasicForm: FC<BasicFormProps> = (props) => {
  const state = history.location.state;
  const editType = state.editType;
  const item = state.item;
  const tableData:Array<{}> =  new Array<{}>()
  if(item && item.commond.length>0){
    for(let i = 0;i<item.commond.length;i++){
      let element = {
        key:i+"",
        reg:item.commond[i]
      };
      tableData.push(element)
    }
  }
  const { submitting } = props;
  const [visible, setVisible] = useState(false);
  const[sourceIpContent,setSourceIpContent] = useState("");
  const[destIpContent,setDestIpContent] = useState("");
  const [ipType, setIpType] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    //编辑初始化表单
    if (editType==="edit") {
      form.setFieldsValue({
        ...item,
        commond:tableData
      });
      if(item.timeRange && item.timeRange!=""){
        form.setFieldsValue({timeRange:[moment(item.timeRange.split("&")[0]),moment(item.timeRange.split("&")[1])]})
      }
      setSourceIpContent(item.sourceIp)
      setDestIpContent(item.destIp)
    }else{
      form.resetFields();
    }
  }, [history])

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
    if(values.timeRange){
      let times: Moment[] = values.timeRange;
      if(times.length ==2){
        let start = moment(times[0]).format('YYYY-MM-DD HH:mm:ss');
        let end = moment(times[1]).format('YYYY-MM-DD HH:mm:ss');
        values.timeRange = start+"&"+end;
      }
    }
    values.destIp = destIpContent
    values.sourceIp = sourceIpContent
    if(values.commond.length>0){
      let commondArray:string[] = new Array();
      for(let i=0;i<values.commond.length;i++){
        commondArray.push(values.commond[i].reg)
      }
      values.commond =  commondArray;
    }
    dispatch({
      type: 'customWhiteList/submitForm',
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
    console.log('edit custom whitelist Failed:', errorInfo);
  };

  const hideIpModal = () => {
    setVisible(false);
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
    <Card bordered={false} title={editType==="add"? "自定义白名单添加":"自定义白名单编辑"}>
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
          initialValues={{commond:tableData}}
        >
          <FormItem name="id" hidden/>
          <FormItem
            {...formItemLayout}
            label={"白名单名称"}
            name="name"
            rules={[
              {
                required: true,
                message: "白名单名称不能为空",
              },
            ]}
          >
            <Input placeholder={"请输入白名单名称"} />
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

          <FormItem
            {...formItemLayout}
            label={"帐号"}
            name="users"
          >
            <TextArea
              style={{ minHeight: 32 }}
              placeholder={"请输入帐号,帐号之间用分号分割 如:root;sys;admin;oracle"}
              rows={8}
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={"时间段"}
            name="timeRange"
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

          <FormItem
            {...formItemLayout}
            label={"命令"}
            name="commond"
            help={"由于正则表达式的特殊性,请使用上面的添加按钮进行命令添加"}
          >
            <RegTableForm/>
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
        <IpMdalForm visible={visible} onCancel={hideIpModal} />
      </Form.Provider>
    </Card>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['customWhiteList/submitForm'],
}))(BasicForm);
