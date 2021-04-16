import React from 'react';
import { Modal, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import {UploadResultItem } from '@/pages/ucenter/dataSyn/data';
import request from 'umi-request';


interface UploadResultModalProps {
  modalVisible: boolean;
  tableDataSource: UploadResultItem[];
  onCancel: () => void;
  onOk:()=> void;
}

const UploadResultModal: React.FC<UploadResultModalProps> = (props) => {
  const { modalVisible,tableDataSource,onCancel,onOk } = props;
  const downLoadResult = (fileName:string) =>{
    request(`/api/ucuser/downLoadFile`, {
      method: 'POST', // GET / POST 均可以
      responseType:'blob',
      credentials: 'include',
      data:{fileName:fileName}
    }).then((response)=>{
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display='none';
      const objectUrl = window.URL.createObjectURL(response);
      aLink.href = objectUrl;
      aLink.download = fileName;
      aLink.click();
      document.body.removeChild(aLink);
    }).catch((error)=>{
      console.log(error);
    })
  }

  const columns: ColumnProps<UploadResultItem>[] = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key:'fileName'
    },
    {
      title: '处理结果',
      dataIndex: 'handleResult',
      key:'handleResult',
      render:(handleResult)=>{
        return handleResult? "成功":"失败";
      }
    },
    {
      title: '描述',
      dataIndex: 'message',
      key:'message'
    },
    {
      title: '结果下载',
      dataIndex: 'resultFileName',
      key:'resultFileName',
      render:(fileName,record)=>{
        if(record.handleResult){
          return <a onClick={(event)=>downLoadResult(fileName)}>下载</a>
        }else{
          return "";
        }
      }
    },
  ];
  return (
    <Modal
      title="文件上传处理结果"
      centered
      width="800"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={() => onOk()}
    >
      <Table dataSource={tableDataSource} columns={columns} rowKey="fileName"/>
    </Modal>
  );
};

export default UploadResultModal;
