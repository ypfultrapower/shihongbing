import React, {useEffect} from 'react';
import {Button, Card, Divider, Input, message, Modal, Pagination, Select} from 'antd';
import {SessionTableListItem} from "@/pages/behavior/session/data";
import {getRecordContent} from "@/pages/behavior/session/service";
import {GridContent} from "@ant-design/pro-layout";
const { TextArea } = Input;
const { Option } = Select;

interface RecordModalProps {
  visible: boolean;
  currentItem: Partial<SessionTableListItem>;
  onCancel: () => void;
}

const RecordModal: React.FC<RecordModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;
  const [refreshInterval,setRefreshInterval] = React.useState<number>(10);
  const [content, setContent] = React.useState<string>("");
  const [total, setTotal] = React.useState<number>(0);
  const [timer, setTimer] = React.useState<NodeJS.Timeout>();
  function recordContentFun(uniqueCode?:string,current:number=1,pageSize:number=50){
    let params = {uniqueCode:uniqueCode,current:current,pageSize:pageSize}
    getRecordContent(params).then((response)=>{
      setContent(response.data.content);
      setTotal(response.data.total)
    }).catch((error)=>{
      message.error(`加载行为日志异常:${error}`)
    });
  }
  useEffect(() => {
    if (!visible) {
      setContent("");
      setRefreshInterval(10);
      setTotal(0);
      if(timer){
        clearInterval(timer)
      }
    }
  }, [props.visible]);

  useEffect(() => {
    if(timer){
      clearInterval(timer)
    }
    if(currentItem && currentItem.sessionType === "online"){
      setTimer(setInterval(() => {
        recordContentFun(currentItem.uniqueCode);
      }, 1000*refreshInterval))
    }
  }, [refreshInterval]);

  useEffect(() => {
    if(currentItem && currentItem.sessionType === "online" && visible){
      recordContentFun(currentItem.uniqueCode);
      setTimer(setInterval(() => {
        recordContentFun(currentItem.uniqueCode);
      }, 1000*refreshInterval))
    }else if(currentItem && currentItem.sessionType === "history"){
      recordContentFun(currentItem.uniqueCode);
    }
  }, [props.currentItem]);
  function itemRender(current:number, type:string, originalElement:any) {
    if (type === 'prev') {
      return <a>上一页</a>;
    }
    if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }
  return(
    <Modal title="行为日志详细"
           width={900}
           centered
           destroyOnClose
           onCancel={onCancel}
           visible={visible}
           footer={[
             <Button key="cancel" type="primary" onClick={onCancel}>关闭</Button>]}>
      <GridContent>
        {currentItem.sessionType ==="online" &&
        <Select placeholder="选择刷新时间" style={{ width: '70%',marginBottom: 10 }} onChange={(value)=>setRefreshInterval(value as number)}>
          <Option value={5}>每5秒</Option>
          <Option value={10}>每10秒</Option>
          <Option value={30}>每30秒</Option>
          <Option value={60}>每1分钟</Option>
        </Select>

        }
        <Card type={"inner"}>
          <TextArea rows={30} value={content}/>
          <Divider/>
          <Pagination total={total} itemRender={itemRender}
                      defaultPageSize={50}
                      showTotal={total => `共 ${total} 条`} onChange={(page, pageSize)=>{
                        recordContentFun(currentItem.uniqueCode,page,pageSize)}}/>
        </Card>
      </GridContent>

  </Modal>)
}
export default RecordModal;

