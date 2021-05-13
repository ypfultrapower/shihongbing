import React, { useEffect } from 'react';
import {Button, Form, Input, Modal, Select} from 'antd';
import {ACCOUNT_REG, IDCARD_REG, PHONE_REG, PWD_REG} from "../../../../../config/systemConfig";
import {UserItem} from "@/pages/authorization/user/data";

interface FormModalProps {
  visible: boolean;
  currentItem: Partial<UserItem> | undefined;
  onSubmit: (values: UserItem) => void;
  onCancel: () => void;
}

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const OperationModal: React.FC<FormModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, currentItem, onCancel, onSubmit } = props;
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.currentItem]);

  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({
        ...currentItem
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
      onSubmit(values as UserItem);
    }
  };
  const getModalContent = () => {
    return (
      <Form form={form}
            name="userForm"
            onFinishFailed={onFinishFailed}
            onFinish={handleFinish}
            >
        <FormItem name="id" hidden/>
        <FormItem
          {...formItemLayout}
          label='登录帐号'
          name="account"
          hasFeedback={true}
          help={"4到16位（字母，数字，下划线，减号）"}
          rules={[
            {
              required: true,
              message: '登录帐号不能为空',
            },
            {
              pattern:new RegExp(ACCOUNT_REG,'g'),
              message:"格式不对"
            }
          ]}
        >
          <Input placeholder='请输入登录帐号' />
        </FormItem>

        {!currentItem &&
        <FormItem
          {...formItemLayout}
          label='登录密码'
          name="password"
          hasFeedback={true}
          help={"最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符"}
          rules={[
            {
              required: true,
              message: '密码不能为空',
            },
            {
              pattern:new RegExp(PWD_REG,'g'),
              message:"密码格式不对"
            }
          ]}
        >
          <Input.Password placeholder='请输入登录密码' />
        </FormItem>
        }
        {!currentItem &&
        <FormItem
          {...formItemLayout}
          label='确认密码'
          name="passwordRep"
          hasFeedback={true}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '请重复输入密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致!'));
              },
            })
          ]}
        >
          <Input.Password placeholder='请重复输入密码' />
        </FormItem>}

        <FormItem
          {...formItemLayout}
          label='姓名'
          hasFeedback={true}
          name="userName"
          rules={[
            {
              required: true,
              message: '姓名不能为空',
            }
          ]}
        >
          <Input placeholder='请输入姓名' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='手机号'
          name="phone"
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: '手机号不能为空',
            },
            {
              pattern:new RegExp(PHONE_REG,'g'),
              message:"手机号格式不对"
            }
          ]}
        >
          <Input placeholder='请输入手机号' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='员工编号'
          name="employeeNo"
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: '员工编号不能为空',
            }
          ]}
        >
          <Input placeholder='请输入员工编号' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='邮箱'
          name="email"
          hasFeedback={true}
          rules={[
            {
              required: true,
              message: '邮箱不能为空',
            },
            {
              type:"email",
              message:"邮箱号格式不对"
            }
          ]}
        >
          <Input placeholder='请输入邮箱' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='身份证号'
          name="idCardNo"
          hasFeedback={true}
          rules={[
            {
              pattern:new RegExp(IDCARD_REG,'g'),
              message:"身份证号格式不对"
            },
            {
              required: true,
              message: '身份证号不能为空',
            }
          ]}
        >
          <Input placeholder='请输入身份证号' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='工作部门'
          name="deptName"
        >
          <Input placeholder='请输入工作部门' />
        </FormItem>


        <FormItem
          {...formItemLayout}
          label='性别'
          name="gender"
          initialValue={"1"}
        >
          <Select placeholder="性别">
            <Option value="1">男</Option>
            <Option value="0">女</Option>
          </Select>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='地址'
          name="address"
        >
          <TextArea
            style={{ minHeight: 32 }}
            placeholder={'请输地址'}
            rows={3}
          />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='备注'
          name="remark"
        >
          <TextArea
            style={{ minHeight: 32 }}
            placeholder={'请输备注信息'}
            rows={3}
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
      title={`帐号${currentItem ? '编辑' : '新增'}`}
      width={800}
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

