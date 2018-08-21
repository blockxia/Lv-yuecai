var config = {
  scheme: 'beta',
  env: {
    beta: {
      prefix: '/pmp',
      adminPrefix: '/admin',
      pmsPrefix: '/pms',
      openUrl:'http://dev.xpms-login.lvyuetravel.com/',
      imagesUrl: 'http://lvyue-static-test.oss-cn-beijing.aliyuncs.com/admin-purchase-platform/zh/static/images/'
    },
    devx: {
      prefix: '',
      adminPrefix: '',
      pmsPrefix: '',
      openUrl:'http://dev.xpms-login.lvyuetravel.com/',
      imagesUrl: 'http://dev.static.lvyuetravel.com/admin-purchase-platform/zh/static/images/'
    },
    test: {
      prefix: '',
      adminPrefix: '',
      pmsPrefix: '',
      openUrl:'http://test.xpms-login.lvyuetravel.com/',
      imagesUrl: 'http://test.static.lvyuetravel.com/admin-purchase-platform/zh/static/images/'
    },
    production: {
      prefix: '',
      adminPrefix: '',
      pmsPrefix: '',
      openUrl:'http://xpms-login.lvyuetravel.com/',
      imagesUrl: 'http://static.lvyuetravel.com/admin-purchase-platform/zh/static/images/'
    }
  },
  domains: {
    urlStatic: '',
    loginSite: ''
  }
};

// 控制环境切换
if (process.env.NODE_COST == 'developer') {
  console.log('developer');
  config.scheme = 'beta'; // 更改环境
}

// 生产环境
if (process.env.NODE_COST == 'production') {
  console.log('production');
  config.scheme = 'production'; // 更改环境
}

// 开发环境
if (process.env.NODE_COST == 'devx') {
  console.log('devx');
  config.scheme = 'devx'; // 更改环境
}

// 测试环境
if (process.env.NODE_COST == 'test') {
  console.log('test');
  config.scheme = 'test'; // 更改环境
}

// 预览环境
if (process.env.NODE_COST == 'preview') {
  console.log('preview');
  config.scheme = 'release'; // 更改环境
}

module.exports = config;
