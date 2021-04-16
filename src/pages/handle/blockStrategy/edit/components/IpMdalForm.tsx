import React, { useState, useEffect, useRef } from 'react';
import {Form, Input, Modal, Select} from 'antd';
import { FormInstance } from 'antd/lib/form';
import {IP_A_REG, IP_B_REG, IP_C_REG, IP_CIDR_REG, IP_LAST_REG, IP_REG} from "../../../../../../config/systemConfig";
const { Option } = Select;
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

const IpModalForm: React.FC<ModalFormProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [ipType,setIpType] = useState<string>("single");
  useResetFormOnCloseModal({
    form,
    visible,
  });
  const onOk = () => {
    form.submit();
  };
  const getIpContent = (ipType:string) => {
    if(ipType === "single"){
      return ( <Form.Item
          label='IP'
          hasFeedback={true}
          name="ip"
          rules={[
            {
              required: true,
              message: 'IP不能为空',
            },
            {
              pattern:IP_REG,
              message:"IP格式不对"
            }
          ]}
        >
          <Input placeholder='请输入IP' />
        </Form.Item>
      )
    }else if(ipType === "cidr"){
      return ( <Form.Item
          label='IP'
          hasFeedback={true}
          name="ip"
          rules={[
            {
              required: true,
              message: 'CIDR格式IP不能为空',
            },
            {
              pattern:IP_CIDR_REG,
              message:"CIDR格式IP不对"
            }
          ]}
        >
          <Input placeholder='请输入CIDR格式IP 格式如：192.168.1.1/24' />
        </Form.Item>
      )
    }else if(ipType === "last"){
      return ( <Form.Item
          label='IP'
          hasFeedback={true}
          name="ip"
          rules={[
            {
              required: true,
              message: 'IP段不能为空',
            },
            {
              pattern:IP_LAST_REG,
              message:"IP段格式不对"
            }
          ]}
        >
          <Input placeholder='请输入IP段 格式如：192.168.1.1-192.168.1.10' />
        </Form.Item>
      )
    }else if(ipType === "rangeC"){
      return ( <Form.Item
          label='IP'
          hasFeedback={true}
          name="ip"
          rules={[
            {
              required: true,
              message: 'C段IP不能为空',
            },
            {
              pattern:IP_C_REG,
              message:"C段IP格式不对"
            }
          ]}
        >
          <Input placeholder='请输入C段IP 格式如：192.168.1/C 或 192.168.1/c' />
        </Form.Item>
      )
    } else if(ipType === "rangeB"){
      return ( <Form.Item
          label='IP'
          hasFeedback={true}
          name="ip"
          rules={[
            {
              required: true,
              message: 'B段IP不能为空',
            },
            {
              pattern:IP_B_REG,
              message:"B段IP格式不对"
            }
          ]}
        >
          <Input placeholder='请输入B段IP 格式如：192.168/B 或 192.168/b' />
        </Form.Item>
      )
    }else if(ipType === "rangeA"){
      return ( <Form.Item
          label='IP'
          hasFeedback={true}
          name="ip"
          rules={[
            {
              required: true,
              message: 'A段ip不能为空',
            },
            {
              pattern:IP_A_REG,
              message:"A段ip格式不对"
            }
          ]}
        >
          <Input placeholder='请输入A段IP 格式如：192/A或 192/a' />
        </Form.Item>
      )
    }

    return ""
  }
  return (
    <Modal title="填写封禁IP" visible={visible} onOk={onOk} onCancel={onCancel} >
      <Form form={form}  name="ipForm" layout="vertical">
        <Form.Item
          label='选择IP格式'
          hasFeedback={true}
          name="ipType"
          initialValue={ipType}
          rules={[
            {
              required: true,
              message: 'IP格式不能空',
            },
          ]}
        >
          <Select placeholder="请选择任务类别" value={ipType} onChange={value => {
            setIpType( value as string)
            form.resetFields(["ip"]);
          }}>
            <Option value="single">单个IP</Option>
            <Option value="cidr">CIDR格式IP</Option>
            <Option value="last">IP段</Option>
            <Option value="rangeC">C段</Option>
            <Option value="rangeB">B段</Option>
            <Option value="rangeA">A段</Option>
          </Select>
        </Form.Item>
        {getIpContent(ipType)}
      </Form>
    </Modal>
  );
};
export default IpModalForm;
