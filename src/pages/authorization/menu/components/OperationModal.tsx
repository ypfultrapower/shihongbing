import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Radio } from 'antd';
import { MenuItem } from './../data';

interface FormModalProps {
  visible: boolean;
  currentItem: Partial<MenuItem> | undefined;
  onSubmit: (values: MenuItem) => void;
  onCancel: () => void;
}

const FormItem = Form.Item;
const { TextArea } = Input;

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
      onSubmit(values as MenuItem);
    }
  };

  const getModalContent = () => {
    return (
      <Form form={form}
            name="menuForm"
            onFinishFailed={onFinishFailed}
            onFinish={handleFinish}
            >
        <FormItem name="id" hidden/>
        <FormItem
          {...formItemLayout}
          label='菜单名称'
          hasFeedback={true}
          name="name"
          rules={[
            {
              required: true,
              message: '菜单名称不能为空',
            },
          ]}
        >
          <Input placeholder='请输入菜单名称' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='菜单路径'
          hasFeedback={true}
          name="path"
          rules={[
            {
              required: true,
              message: '菜单路径不能为空',
            },
          ]}
        >
          <Input placeholder='请输入菜单路径' />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label='菜单图标'
          name="icon"
        >
          <Input placeholder='请输入菜单图标' />
        </FormItem>


        <FormItem
          {...formItemLayout}
          label='菜单状态'
          hasFeedback={true}
          name="disabled"
          initialValue="0"
          rules={[
            {
              required: true,
              message: '菜单状态不能为空',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="1">禁用</Radio>
            <Radio value="0">启用</Radio>
          </Radio.Group>
        </FormItem>

        <FormItem {...formItemLayout} label="排序"
                  name="displayOrder"
                  initialValue={1}
                  hasFeedback={true}
                  rules={[{
                    whitespace:true,
                    required: true,
                    min:0,
                    type:'integer',
                    transform:(val)=>{
                      return Number(val);
                    },
                    message: '请输入大于等于0的数字',
                  }]}
        >
          <Input placeholder='请输入排序位置' />
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
      title={`菜单${currentItem ? '编辑' : '新增'}`}
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

