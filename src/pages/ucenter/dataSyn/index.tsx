import { DownOutlined,UploadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Card, Upload, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, UploadResultItem } from './data.d';
import { updateRule, addRule, removeRule, queryUCUser } from './service';
import { BASE_URL } from '../../../../config/systemConfig';
import { UploadChangeParam } from 'antd/es/upload';
import CreateUploadResultModal from './components/UploadResultModal';
import { UploadFile } from 'antd/es/upload/interface';
import { RcFile } from 'antd/lib/upload/interface';
import request from 'umi-request';
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.description,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [resultDataSource,setResultDataSource] = useState< UploadResultItem[]>([]);
  const [stepFormValues, setStepFormValues] = useState({});
  const [uploadResultVisible,setUploadResultVisible] = useState(false);
  const [uploadModalVisible,setUploadModalVisible] = useState(false);
  const [fileList,setFileList] = useState<any[]>([])
  const [upFiles,setUpFiles] = useState<any[]>([])
  const actionRef = useRef<ActionType>();
  const detailColumns: ProColumns<TableListItem>[] = [
    {
      title: '简称',
      dataIndex: 'shortName',
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
    },
    {
      title: 'ERP_ID用户中心组织编码',
      dataIndex: 'erpId',
    },
    {
      title: '角色',
      dataIndex: 'function',
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    }
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      className:'notshow'
    },
    {
      title: '登录名',
      dataIndex: 'userId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
    },
    {
      title: '身份证号',
      dataIndex: 'idcardNum',
    },
    {
      title: '员工类型',
      dataIndex: 'userType',
      hideInForm: true,
      valueEnum: {
        0: { text: '内部', status: 'Success' },
        1: { text: '外部', status: 'Error' }
      },
    },
    {
      title: '状态',
      dataIndex: 'logicDelete',
      hideInForm: true,
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '删除', status: 'Error' }
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            编辑
          </a>
        </>
      ),
    },
  ];

  //const detailColumns = ["desc","name"];
  const expandableRender = (record: TableListItem)=>{
    return <Card title="其他详细信息" bordered={false}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  }
  //
  const handleChange = (info:UploadChangeParam)  =>{
    let files: UploadFile[] = [...info.fileList]
    setFileList(files)
  }

  const beforeUpload = (file:RcFile)=>{
    upFiles.push(file);
    setUpFiles(upFiles);
    return true;
  }
  //上传文件
  const upload = ()=>{
    const formData = new FormData();
    if(upFiles.length==0){
      message.info(`请选择文件!`)
      return;
    }
    upFiles.forEach((file)=>{
      formData.append(file.name,file);
    });
    request(`${BASE_URL}`+`/api/ucuser/uploadFiles`, {
      method: 'POST',
      body:formData
    }).then((response)=>{
      let results = response.data;
      console.log(results);
      setUploadModalVisible(false);
      setResultDataSource(results.data);
      setUploadResultVisible(true);
    }).catch((error)=>{
      console.log(error);
      message.error(`上传失败文件失败${error}`)
    })
  }

  return <PageHeaderWrapper>
    <ProTable<TableListItem>
      headerTitle="用户列表"
      actionRef={actionRef}
      rowKey="id"
      expandable={{
        expandedRowRender:record =>{return expandableRender(record)},
        expandRowByClick:true
      }}
      expandRowByClick={true}
      toolBarRender={(action, { selectedRows }) => [
        <Button icon={<UploadOutlined />} onClick={()=>setUploadModalVisible(true)} type="primary">上传文件</Button>,
        selectedRows && selectedRows.length > 0 && <Dropdown
            overlay={
              <Menu
                onClick={async (e) => {
                  if (e.key === 'remove') {
                    await handleRemove(selectedRows);
                    action.reload();
                  }
                }}
                selectedKeys={[]}
              >
                <Menu.Item key="remove">批量删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
              </Menu>
            }
          >
            <Button>
              批量操作 <DownOutlined />
            </Button>
          </Dropdown>,
      ]}
      tableAlertRender={({ selectedRowKeys, selectedRows }) => <div>
          已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          {/*<span>*/}
          {/*  服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万*/}
          {/*</span>*/}
        </div>}
      request={(params, sorter, filter) => queryUCUser({ ...params, sorter, filter })}
      columns={columns}
      rowSelection={{}}
    />
    <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
      <ProTable<TableListItem, TableListItem>
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        rowKey="id"
        type="form"
        columns={columns}
        rowSelection={{}}
      />
    </CreateForm>
    {stepFormValues && Object.keys(stepFormValues).length ? <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setStepFormValues({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        updateModalVisible={updateModalVisible}
        values={stepFormValues}
      /> : null}

    {/*上传文件modal modal*/}
    <Modal title='选择上传文件' visible={uploadModalVisible} onOk={upload} onCancel={()=>{
      setUploadModalVisible(false);
      setUpFiles([]);
      setFileList([]);
    }} >
      <Upload multiple
              name='file'
              accept=".xlsx"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={beforeUpload}
              progress={{
                strokeColor: {
                  '0%': '#108ee9',
                  '100%': '#87d068',
                },
                strokeWidth: 3
              }}
      >
        <Button icon={<UploadOutlined />} type="primary">选择文件</Button>,
      </Upload>,
    </Modal>
    {/*文件上传处理结果 modal*/}
    <CreateUploadResultModal
      modalVisible={uploadResultVisible}
      onOk={()=>setUploadResultVisible(false)}
      onCancel={()=>setUploadResultVisible(false)}
      tableDataSource={resultDataSource}>
    </CreateUploadResultModal>

  </PageHeaderWrapper>;
};

export default TableList;
