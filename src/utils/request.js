/**
 * 请求模块
 */
import axios from "axios";
import store from "@/store"; // <===========增加
import jsonBig from "json-bigint";
import router from "@/router";

const request = axios.create({
    baseURL: "http://toutiao-app.itheima.net/", // 接口的基准路径
    // baseURL: 'http://192.168.11.56:8000'
    //处理js后台大数字问题
    // transformResponse 允许自定义原始的响应数据（字符串）
    transformResponse: [
        function(data) {
            try {
                // 如果转换成功则返回转换的数据结果
                return jsonBig.parse(data);
            } catch (err) {
                // 如果转换失败，则包装为统一数据格式并返回
                return data;
            }
        }
    ]
});

// 请求拦截器   <===========增加
request.interceptors.request.use(
    function(config) {
        // config ：本次请求的配置对象
        // config 里面有一个属性：headers
        const { user } = store.state;
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
    //正确写法:
    // function(config) {
    //     // config ：本次请求的配置对象
    //     // config 里面有一个属性：headers
    //     //判断请求的接口地址是否需要token才可以访问，如果需要token就判断是否登录了,有才可以访问
    //     let authList = [],
    //         if (authList.includes(config.url)) {
    //             // 该接口需要token才可以访问
    //             const { user } = store.state;
    //             if (user && user.token) {
    //                 config.headers.Authorization = `Bearer ${user.token}`;
    //             } else {
    //                 return Promise.reject(new Error('该接口需要登录才可以访问'))
    //             }
    //         }
    //     return config;
    // },
    // function(error) {
    //     return Promise.reject(error);
    // }
);

// 响应拦截器
request.interceptors.response.use(
    function(response) {
        //一定要return
        return response;
    },
    async function(error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // 如果响应码是 401 ，则请求获取新的 token

        // 响应拦截器中的 error 就是那个响应的错误对象

        console.dir(error);
        if (error.response && error.response.status === 401) {
            const user = store.state.user;
            // 校验是否有 refresh_token
            if (!user || !user.refresh_token) {
                router.push("/login");
                // 代码不要往后执行了
                return;
            }
            //如果有refresh_token则请求获取新的token
            try {
                const res = await axios({
                    url: "http://toutiao-app.itheima.net/v1_0/authorizations",
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${user.refresh_token}`
                    }
                });
                //如果成功则把新的token跟新到容器中
                console.log("刷新token成功", res);
                store.commit("setUser", {
                    token: res.data.data.token, // 最新获取的可用 token
                    refresh_token: user.refresh_token // 还是原来的 refresh_token
                });
                // 把之前失败的用户请求继续发出去
                // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
                // return 把 request 的请求结果继续返回给发请求的具体位置
                return request(error.config);
            } catch (err) {
                // 如果获取失败，直接跳转 登录页
                console.log("请求刷线 token 失败", err);
                router.push("/login");
            }
        }
        return Promise.reject(error);
    }
);

export default request;