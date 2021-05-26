class WSSHClient{
  // websocket通讯地址
  websocketUrl: string;
  connection?: WebSocket;
  // 构造函数
  constructor(websocketUrl:string) {
    this.websocketUrl = websocketUrl
  }

  generateEndpoint ():string {
   let protocol;
    if (window.location.protocol == 'https:') {
      protocol = 'wss://';
    } else {
      protocol = 'ws://';
    }
    return protocol + this.websocketUrl+'?access_token='+localStorage.getItem("access_token");
  };

  connect(options:any):void{
    let endpoint = this.generateEndpoint();
    if (window.WebSocket) {
      //如果支持websocket
      this.connection = new WebSocket(endpoint);
    }else {
      //否则报错
      options.onError('WebSocket Not Supported');
      return;
    }
    this.connection.onopen = function () {
      options.onConnect();
    };

    this.connection.onmessage = function (evt) {
      let data = evt.data.toString();
      options.onData(data);
    };
    this.connection.onclose = function (evt) {
      options.onClose();
    };

  }

  send(data:{}):void {
    this.connection?.send(JSON.stringify(data));
  }
  sendConnectData(options:{}):void{
    //连接参数
    this.connection?.send(JSON.stringify({"operate": "connect",...options}));
  }
  sendCommand(command:string):void{
    //发送指令
    this.connection?.send(JSON.stringify({"operate": "command", "command": command}))
  }
}

export default WSSHClient;
