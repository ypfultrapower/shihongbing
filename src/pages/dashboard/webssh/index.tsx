import React, {useEffect} from "react";
import { Terminal } from 'xterm';
import WSSHClient from "@/utils/webssh";
import 'xterm/css/xterm.css'
import {WEBSSH_SOCKETURL} from "../../../../config/systemConfig";

const WebTerminal: React.FC<{}> = () => {
  useEffect(() => {
    const options = {
      host: "106.55.159.234",//IP
      port: "22",//端口号
      username: "root",//用户名
      password: "iam#16ZlsYnyd1234!"//密码
    }
    openTerminal(options);
  }, []);

  const openTerminal = (options:{})=>{
    const client = new WSSHClient(WEBSSH_SOCKETURL);
    const term = new Terminal({
      cols: 97,
      rows: 37,
      cursorBlink: true, // 光标闪烁
      cursorStyle: "block", // 光标样式  null | 'block' | 'underline' | 'bar'
      scrollback: 800, //回滚
      tabStopWidth: 8, //制表宽度
    });
    term.onData(function(data){
      //键盘输入时的回调函数
      client.sendCommand(data);
    })
    //@ts-ignore
    term.open(document.getElementById('terminal'));
    term.focus();
    //在页面上显示连接中...
    term.write('Connecting...');
    //执行连接操作
    client.connect({
      onError: function (error:any) {
        //连接失败回调
        term.write('Error: ' + error + '\r\n');
        console.log('Error: ' + error + '\r\n');
      },
      onConnect: function () {
        //连接成功回调
        client.sendConnectData(options);
        console.log(options);
      },
      onClose: function () {
        //连接关闭回调
        term.write("\rconnection closed");
        term.dispose();
        console.log("\rconnection closed");
      },
      onData: function (data:any) {
        //收到数据时回调
        term.write(data);
        console.log(data);
      }
    });
  }
  return <div id="terminal"></div>;

}
export default WebTerminal;
