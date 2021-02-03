import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // allowHeaders: 'Authorization,Content-Length,Content-Type',
    credentials: true,
  };

  config.security = {
    csrf: { enable: false },
  };
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1611937511671_9018';

  // add your egg config in here
  config.middleware = ['isLogin'];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // 开启前置代理
  config.proxy = true;
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
