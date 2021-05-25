import React, {useEffect} from 'react';
import {Button, Card, Modal} from 'antd';
import {GridContent} from "@ant-design/pro-layout";
import {ESSessionItem} from "@/pages/behavior/essession/data";
import {Segment} from "semantic-ui-react";

interface RecordModalProps {
  visible: boolean;
  currentItem: Partial<ESSessionItem>;
  onCancel: () => void;
}

const RecordModal: React.FC<RecordModalProps> = (props) => {
  const { visible, currentItem, onCancel } = props;
  const [content, setContent] = React.useState<string>("");
  useEffect(() => {
    if (!visible) {
      setContent("");
    }
  }, [props.visible]);


  useEffect(() => {
    if(currentItem){
      setContent(currentItem.content ===undefined ?"" :currentItem.content);
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
        <Card type={"inner"}>
          <Segment dangerouslySetInnerHTML={{ __html: content }}/>
        </Card>
      </GridContent>

    </Modal>)
}
export default RecordModal;

