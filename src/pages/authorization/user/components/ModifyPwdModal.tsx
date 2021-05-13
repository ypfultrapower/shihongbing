import React, {useEffect} from 'react';
import {Button, Form, Input, message, Modal} from 'antd';
import {UserItem} from "@/pages/authorization/user/data";
import {PWD_REG} from "../../../../../config/systemConfig";
import {modifyPwd} from "@/pages/authorization/user/service";


interface DetailModalProps {
  visible: boolean;
  currentItem: Partial<UserItem>;
  onCancel: () => void;
}
const FormItem = Form.Item;

const ModifyPwdModal: React.FC<DetailModalProps> = (props) => {
  const [form] = Form.useForm();
  const { visible, currentItem, onCancel } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.currentItem]);

  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({id:currentItem.id});
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
  //表单验证失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const handleFinish = (values: { [key: string]: any }) => {
    modifyPwd(values).then((response)=>{
      if(response.success){
        message.info("修改密码成功!")
        onCancel();
      }else{
        message.error(response.message,8);
      }
    }).catch((error)=>{
      message.error(`修改密码失败${error}`)
    })
  };

  return(
    <Modal title="密码修改"
           bodyStyle={{ padding: '28px 0 0',backgroundColor:"cornsilk" }}
           width={750}
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[<Button key="submit" type="primary" onClick={handleSubmit} htmlType="submit">提交</Button>,
             <Button key="cancel" htmlType="button" onClick={onCancel}>取消</Button>]}>
      <Form form={form}
            name="userForm"
            onFinishFailed={onFinishFailed}
            onFinish={handleFinish}>
        <FormItem name="id" hidden/>
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
        </FormItem>
      </Form>

  </Modal>)
}
export default ModifyPwdModal;

