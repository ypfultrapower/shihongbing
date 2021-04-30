import React, {useEffect} from 'react';
import {Button, Card, Input, message, Modal, Select} from 'antd';
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
  const [timer, setTimer] = React.useState<NodeJS.Timeout>();
  function recordContentFun(currentItem: Partial<SessionTableListItem>){
    getRecordContent(currentItem.uniqueCode).then((response)=>{
      setContent(response.data);
    }).catch((error)=>{
      message.error(`加载行为日志异常:${error}`)
    });
  }
  useEffect(() => {
    if (!visible) {
      setContent("");
      setRefreshInterval(10)
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
        recordContentFun(currentItem);
      }, 1000*refreshInterval))
    }
  }, [refreshInterval]);

  useEffect(() => {
    if(currentItem && currentItem.sessionType === "online" && visible){
      recordContentFun(currentItem);
      setTimer(setInterval(() => {
        recordContentFun(currentItem);
      }, 1000*refreshInterval))
    }else if(currentItem && currentItem.sessionType === "history"){
      recordContentFun(currentItem);
    }
  }, [props.currentItem]);
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
          <TextArea rows={40} value={content}/>
        </Card>
      </GridContent>

  </Modal>)
}
export default RecordModal;

