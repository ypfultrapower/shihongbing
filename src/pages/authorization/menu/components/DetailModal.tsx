import { MenuDetail, MenuItem } from '@/pages/authorization/menu/data';
import React from 'react';
import { Button, Col, List, Modal, Row, Typography } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { ProColumns } from '@ant-design/pro-table';


interface DetailModalProps {
  visible: boolean;
  detailColumns: ProColumns<MenuItem>[];
  currentItem: Partial<MenuItem>;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { visible, currentItem, onCancel,detailColumns } = props;
  const leftDataSource: MenuDetail[]  = new Array();
  const rightDataSource: MenuDetail[]  = new Array();
  detailColumns.forEach((cloumn, index, array) => {
    if(!(cloumn.dataIndex === 'option')){
      let element: MenuDetail;
      if(cloumn.dataIndex ==='disabled'){
        element= {
          title: cloumn.title,
          value: currentItem[cloumn.dataIndex as string] =='1'?"禁用":"启用"
        }
      }else {
        element= {
          title: cloumn.title,
          value: currentItem[cloumn.dataIndex as string]
        }
      }
      if(index%2==0){
        leftDataSource.push(element);
      }else{
        rightDataSource.push(element);
      }
    }
  })
  return(
    <Modal title="菜单详细信息"
           width={800}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
      <GridContent>
        <Row gutter={24}>
          <Col lg={12} md={24}>
            <List dataSource={leftDataSource} size="small"
            renderItem={item=>(
              <List.Item>
                <Typography.Title level={5}>{item.title}:</Typography.Title>
                <Typography.Text>{item.value}</Typography.Text>
              </List.Item>
            )}>
            </List>
          </Col>
          <Col lg={12} md={24}>
            <List dataSource={rightDataSource}  size="small"
                  renderItem={item=>(
                    <List.Item>
                      <Typography.Title level={5}>{item.title}:</Typography.Title>
                      <Typography.Text>{item.value}</Typography.Text>
                    </List.Item>
                  )}>
            </List>
          </Col>
        </Row>
      </GridContent>
  </Modal>)
}
export default DetailModal;

