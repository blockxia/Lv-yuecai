## 前端项目代码
-dist文件夹-编译后文件

- #### 系统名称：旅悦采购系统平台端

- #### 开发人员
  - 前端开发：孙磊、王晨
  - 服务端：魏同明
  - 产品：于中飞
  - 测试：
  - UI：吴刚
- #### 项目地址
  - [项目交互地址] 
  - [文档地址] 
  - [视觉地址](xxx)--待定
- #### 项目主要目录结构
        doc // 文档说明，比如接口说明
        mock // mock数据
        src
            actions // 定义页面操作触发的动作
            api // 接口
            components // 组件
            config // 区分环境变量
            containers // view
            images // 静态资源-图片
            middleware // 中间件
            reducers // state
            stylesheet // 样式
            utils // 公共方法
            history.js
            main.js // 首页js
            routers.js // 路由的管理
            store.js // store
            storage.js // 缓存
        static // 静态资源
            jquery
        test // 测试
        .eslintrc // eslint检测规则
        .bower.json
        package.json
        webpack.config.js // webpack构建
        index.html // 首页
- #### 项目命令
  - 版本管理使用git,down代码前请确保安装
  - bower i 、 cnpm i 安装依赖，可使用nrm切换成淘宝镜像，直接使用npm
  - npm run dev 进行本地调试
  - npm run devx 进行开发环境打包
  - npm run test 进行测试环境打包
  - npm run  prod 进行生产环境打包
  - npm run lint 语法检测
- #### 其他说明
  - 当前项目，react版本为15.3.2
  - react-router 2.6.0
  - react-redux 4.4.5
<!-- react-addons-test-utils -->
