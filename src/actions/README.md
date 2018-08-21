## ACTION 命名规范
    xxx.js login页面
    xxx.js register页面

    如果action 太多可以适当的建立文件夹
      Login
        xxx.js
        xxx.js
....


// 使用demo
const url_prefix = Config.env[Config.scheme].prefix;
axios.get(`${url_prefix}/sys/get_lang.json`).then(function(res){
  console.log(res);
})
