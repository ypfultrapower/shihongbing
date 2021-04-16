import React, { useEffect, useRef } from 'react';
import {Form, Input, Modal} from 'antd';
import { FormInstance } from 'antd/lib/form';
interface ModalFormProps {
  visible: boolean;
  onCancel: () => void;
}

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }: { form: FormInstance; visible: boolean }) => {
  const prevVisibleRef = useRef<boolean>();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};

const RegModalForm: React.FC<ModalFormProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });
  const onOk = () => {
    form.submit();
  };
  return (
    <Modal title="填写封禁命令" visible={visible} onOk={onOk} onCancel={onCancel} >
      <Form form={form}  name="regForm" layout="vertical">
        <Form.Item
          label='封禁命令正则'
          hasFeedback={true}
          name="reg"
          rules={[
            {
              required: true,
              message: '封禁命令不能为空',
            }
          ]}
        >
          <Input placeholder='请输入封禁命令正则表达式' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default RegModalForm;
