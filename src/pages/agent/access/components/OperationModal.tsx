import React, { useEffect } from 'react';
import {Button, DatePicker, Form, Input, message, Modal, Select} from 'antd';
import {AgentTableListItem} from "@/pages/agent/data";
import {IP_REG} from "../../../../../config/systemConfig";
import moment from "moment";
import {queryAssetGroup} from "@/pages/agent/service";

interface FormModalProps {
  visible: boolean;
  currentItem: Partial<AgentTableListItem> | undefined;
  onSubmit: (values: AgentTableListItem) => void;
  onCancel: () => void;
}

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const OperationModal: React.FC<FormModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, currentItem, onCancel, onSubmit } = props;
  const [options, setOptions] = React.useState<[]>([]);
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
    queryAssetGroup({}).then((response)=>{
      let results = response.data;
       let arr:[]  = results.map((item:any,index:any)=>{
        return <Option value={item.id}>{item.groupName}</Option>
      })
      setOptions(arr);
    }).catch((error)=>{
      console.log(error);
      message.error(`加载资产组失败发生错误:${error}`)
    });
  }, [props.currentItem]);

  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({
        ...currentItem,
        applyTime: currentItem.applyTime ? moment(currentItem.applyTime) : null,
      });
    }
  }, [props.currentItem]);

  //是否显示间隔周期表单元素
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as AgentTableListItem);
    }
  };

  const getModalContent = () => {
    return (
      <Form form={form}
            name="agentForm"
            onFinishFailed={onFinishFailed}
            onFinish={handleFinish}
            >
        <FormItem name="id" hidden/>
        <FormItem
          {...formItemLayout}
          label='Agent编号'
          hasFeedback={true}
          name="agentId"
          rules={[
            {
              required: true,
              message: 'agent编号不能为空',
            },
          ]}
        >
          <Input placeholder='请输入Agent编号' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='Agent名称'
          name="name"
        >
          <Input placeholder='请输入Agent名称' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='Agent IP'
          hasFeedback={true}
          name="agentIp"
          rules={[
            {
              required: true,
              message: 'ip不能为空',
            },
            {
              pattern:IP_REG,
              message:"ip格式不对"
            }
          ]}
        >
          <Input placeholder='请输入Agent宿主机IP' />
        </FormItem>


        <FormItem
          {...formItemLayout}
          label='资产所属部门'
          hasFeedback={true}
          name="assetGroupId"
          rules={[
            {
              required: true,
              message: '资产所属部门不能为空',
            },
          ]}
        >
          <Select placeholder="请选择宿主机资产所属部门">
            {options}
          </Select>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='申请入网时间'
          hasFeedback={true}
          name="applyTime"
          rules={[
            {
              required: true,
              message: '申请入网时间不能为空',
            },
            {
              type: 'date',
              message: '申请入网时间格式不对',
            }
          ]}
        >
          <DatePicker format={'YYYY-MM-DD HH:mm:ss'} showNow={true} showTime={true}/>
        </FormItem>


        <FormItem
          {...formItemLayout}
          label='版本号'
          name="version"
        >
          <Input placeholder='请输入Agent版本号' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='详情'
          name="description"
        >
          <TextArea
            style={{ minHeight: 32 }}
            placeholder={'请输Agent详情信息'}
            rows={4}
          />
        </FormItem>
      </Form>
    );
  };

  //表单验证失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title={`Agent${currentItem ? '编辑' : '新增'}`}
      width={700}
      bodyStyle={{ padding: '28px 0 0',backgroundColor:"cornsilk" }}
      destroyOnClose
      onCancel={onCancel}
      visible={visible}
      footer={[<Button key="submit" type="primary" onClick={handleSubmit} htmlType="submit">提交</Button>,
        <Button key="cancel" htmlType="button" onClick={onCancel}>取消</Button>]}
    >
      {getModalContent()}
    </Modal>
  );
};
export default OperationModal;

