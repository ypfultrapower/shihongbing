import React, { useEffect } from 'react';
import {Button, Form, Input, Modal} from 'antd';
import {WhiteUserItem} from "@/pages/handle/whitelist/data";

interface FormModal {
  visible: boolean;
  submitting:boolean;
  currentItem: Partial<WhiteUserItem> | undefined;
  onSubmit: (values: WhiteUserItem) => void;
  onCancel: () => void;
}

const FormItem = Form.Item;

const OperationModal: React.FC<FormModal> = (props) => {
  const [form] = Form.useForm();
  const { visible, currentItem, onCancel, onSubmit,submitting } = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (currentItem) {
      form.setFieldsValue({
        ...currentItem
      });
    }
  }, [props.currentItem]);

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
      onSubmit(values as WhiteUserItem);
    }
  };

  const getModalContent = () => {
    return (
      <Form form={form}
            name="fortForm"
            onFinishFailed={onFinishFailed}
            onFinish={handleFinish}
      >
        <FormItem name="id" hidden/>

        <FormItem
          {...formItemLayout}
          label='登录帐号'
          hasFeedback={true}
          name="user"
          rules={[
            {
              required: true,
              message: '帐号不能为空',
            }
          ]}
        >
          <Input placeholder='请输入登录帐号' />
        </FormItem>



      </Form>
    );
  };
  //表单验证失败
  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title={`登录帐号白名单${currentItem ? '编辑' : '添加'}`}
      width={500}
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

