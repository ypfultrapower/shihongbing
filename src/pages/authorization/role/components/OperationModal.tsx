import React, { useEffect } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import {RoleTreeDataNode } from './../data';
import { Dispatch } from 'umi';
interface FormModalProps {
  visible: boolean;
  type: string|undefined;
  role: Partial<RoleTreeDataNode>| undefined;
  onCancel: () => void;
  dispatch: Dispatch;
  submitting?: boolean;
}

const FormItem = Form.Item;
const { TextArea } = Input;

const OperationModal: React.FC<FormModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible,type, role, onCancel,dispatch,submitting} = props;
  useEffect(() => {
    if(type==="add" || !visible){
      form.resetFields();
    }else{
      if (role && visible) {
        form.setFieldsValue({
          ...role
        });
      }
    }
  }, [visible]);


  //是否显示间隔周期表单元素
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
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
    dispatch({
      type: 'authorizationRole/submit',
      payload: {optType:type,...values},
      callback:(res:any)=>{
        if(res.success){
          onCancel();
          message.success(res.message);
          dispatch({
            type: 'authorizationRole/fetchRoleTree',
          });
        }else{
          message.error(res.message);
        }
      }
    });
  };

  const getModalContent = () => {
    return (
      <Form form={form}
            name="roleForm"
            onFinishFailed={onFinishFailed}
            onFinish={handleFinish}
            >
        <FormItem name="id" hidden/>
        <FormItem
          {...formItemLayout}
          label='角色名称'
          hasFeedback={true}
          name="roleName"
          rules={[
            {
              required: true,
              message: '角色名称不能为空',
            },
          ]}
        >
          <Input placeholder='请输入角色名称' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='角色编码'
          hasFeedback={true}
          name="roleCode"
          rules={[
            {
              required: true,
              message: '角色编码不能为空',
            }
          ]}
        >
          <Input placeholder='请输入角色编码' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='备注'
          name="remarks"
        >
          <TextArea
            style={{ minHeight: 32 }}
            placeholder={'请输入备注信息'}
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
      title={`角色${role ? '编辑' : '新增'}`}
      width={700}
      bodyStyle={{ padding: '28px 0 0',backgroundColor:"cornsilk" }}
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
