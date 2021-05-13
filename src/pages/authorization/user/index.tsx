import React, {useRef, useState} from "react";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Card, Divider, Dropdown, Menu, message, Modal} from "antd";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {UserItem} from "@/pages/authorization/user/data";
import {addUser, batchDeleteUser, modifyUser, pageQuery} from "@/pages/authorization/user/service";
import DetailModal from "@/pages/authorization/user/components/DetailModal";
import OperationModal from "@/pages/authorization/user/components/OperationModal";
import AuthorizeRoleModal from "@/pages/authorization/user/components/AuthorizeRoleModal";
import ModifyPwdModal from "@/pages/authorization/user/components/ModifyPwdModal";


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [detailModalVisible,setDetailModalVisible]  = useState<boolean>(false);
  const [authorizeModalVisible,setAuthorizeModalVisible]  = useState<boolean>(false);
  const [modifyPwdModalVisible,setModifyPwdModalVisible]  = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<UserItem> | undefined>(undefined);

  const detailColumns: ProColumns<UserItem>[] =[
    {
      title: '邮箱',
      dataIndex: 'email',
      key:'email',
    },
    {
      title: '身份证号',
      dataIndex: 'idCardNo',
      key:'idCardNo',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key:'createTime'
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key:'createUser'
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key:'modifyTime'
    },
    {
      title: '修改人',
      dataIndex: 'modifyUser',
      key:'modifyUser'
    },
    {
      title: '所在部门',
      dataIndex: 'deptName',
      key:'deptName'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key:'address'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key:'remark'
    }
  ];
  const columns:ProColumns<UserItem>[] = [
    {
      title: '帐号',
      dataIndex: 'account',
      key:'account',
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key:'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key:'phone',
    },
    {
      title: '员工编号',
      dataIndex: 'employeeNo',
      key:'employeeNo',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: {
        '1': { text: '男',status: 'Success'},
        '0': { text: '女',status: 'Warning'}
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>{
        return ((
          <>
            <a
              onClick={() =>{
                  setCurrentItem(record);
                  setAuthorizeModalVisible(true)
              }}
            >
              角色授权
            </a>
            <Divider type="vertical" />
            <a
              onClick={() =>{
                setCurrentItem(record);
                setModifyPwdModalVisible(true)
              }}
            >
              修改密码
            </a>
            <Divider type="vertical" />
            <MoreBtn key="more" record={record} />
          </>
        ))
      }
    }
  ];

  //批量删除
  const batchDelete = (selectedRows: UserItem[]) => {
    Modal.confirm({
      title: '帐号删除',
      content: '确定删除该帐号吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {
          const params =  selectedRows.map((row) => {
            return {"id":row.id}
          });
          await batchDeleteUser(params);
          hide();
          message.success('删除成功，即将刷新');
          if(actionRef.current) actionRef.current.reload();
          return true;
        } catch (error) {
          hide();
          message.error('删除失败，请重试');
          return false;
        }
      }
    });
  };

  const showCreateFormModal = () => {
    setVisible(true);
    setCurrentItem(undefined);
  };
  //显示修改菜单Modal框
  const showEditFormModal = (item: UserItem) => {
    setVisible(true);
    setCurrentItem(item);
  };
  const showDetailModal = (item: UserItem) =>{
    setDetailModalVisible(true);
    setCurrentItem(item);
  }

  //取消表单操作
  const handleCancel = () => {
    setVisible(false);
    setCurrentItem(undefined);
  };

  //表单提交
  const handleSubmit = async (values: UserItem) => {
    const hide = message.loading('正在提交数据');
    try{
      //修改
      if(currentItem){
        await modifyUser(values).then((response)=>{
          hide();
          message.success(response.message);
          setVisible(false);
        })
      }
      //新增
      else{
        await addUser(values).then((response)=>{
          hide();
          message.info(response.message);
          setVisible(false);
        })
      }
      if(actionRef.current) actionRef.current.reload();
    }catch (error) {
      hide();
      message.error(`表单提交失败,发生错误:${error}`);
    }
  };

  //编辑,修改,详细
  const crudAction =  (key: string, currentItem: UserItem) => {
    if (key === 'edit') showEditFormModal(currentItem);
    else if (key === 'delete') {
      const array: UserItem[] = new Array();
      array.push(currentItem);
      batchDelete(array);
    }else if(key === 'detail'){
      showDetailModal(currentItem);
    }
  };

  //角色授权

  //展开信息
  const expandableRender = (record: UserItem)=>{
    return <Card title="其他详细信息" bordered={false} headStyle={{backgroundColor:"lightskyblue"}} bodyStyle={{backgroundColor:"#e9e9e9"}}>
      {detailColumns.map(value => (
        <p><strong>{value.title}: </strong>{record[value.dataIndex as string]}</p>
      ))}
    </Card>;
  };
  //更多action操作
  const MoreBtn: React.FC<{
    record: UserItem;
  }> = ({ record }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => crudAction(key as string, record)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="detail">详细</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );
  return (
    <div>
      <PageHeaderWrapper>
        <ProTable<UserItem>
          headerTitle="帐号列表"
          rowClassName={((record, index) => {
            let className = "light-row";
            if(index%2===1) className = "dark-row";
            return className;
          })}
          actionRef={actionRef}
          rowKey="id"
          expandable={{
            expandedRowRender:record =>{return expandableRender(record)},
            expandRowByClick:false
          }}
          onRow={record=>{
            return {
              onDoubleClick:event => {showDetailModal(record)}
            }
          }}
          toolBarRender={(action, { selectedRows }) => [
            <Button type="primary" onClick={showCreateFormModal}>
              <PlusOutlined /> 添加帐号
            </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'batchDelete') {
                        await batchDelete(selectedRows);
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="batchDelete">批量删除</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  批量操作 <DownOutlined />
                </Button>
              </Dropdown>
            ),
          ]}
          tableAlertRender={({ selectedRowKeys, selectedRows }) => (
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            </div>
          )}
          request={(params, sorter, filter) => pageQuery({...params, sorter, filter })}
          columns={columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
      {/*编辑和新增modal框*/}
      <OperationModal
        currentItem={currentItem}
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
      {/*详细信息modal框*/}
      <DetailModal visible={detailModalVisible}
                   currentItem={currentItem?currentItem:{}}
                   onCancel={()=>{
                     setDetailModalVisible(false);
                     setCurrentItem(undefined);}}>
      </DetailModal>
      <AuthorizeRoleModal visible={authorizeModalVisible} currentItem={currentItem?currentItem:{}}  onCancel={()=>{
        setAuthorizeModalVisible(false);
        setCurrentItem(undefined);}}>
      </AuthorizeRoleModal>
      <ModifyPwdModal visible={modifyPwdModalVisible} currentItem={currentItem?currentItem:{}}
                      onCancel={()=>{
                        setModifyPwdModalVisible(false);
                        setCurrentItem(undefined);}}>
      </ModifyPwdModal>
    </div>
  );
}
export default TableList;
