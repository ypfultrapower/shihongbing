import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale:false,//是否开启国际化 true开启
  },
  title: '安全感知',//修改左上角展示内容，logo修改 assets下面的logo.svg
  pwa: false,
  iconfontUrl: '',
};

export type { DefaultSettings };

export default proSettings;

