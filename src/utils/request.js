import axios from "axios";
//Axios 实例的 “基础设施配置”，是全局的、初始化时执行的逻辑，通常放在项目的公共工具模块中
const api = axios.create({
  baseURL: "http://27.17.30.150:40095", // 后端接口基础路径
  timeout: 5000, // 超时时间 5 秒
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  //成功回调，当请求准备发送（参数、配置均正常）时触发
  (config) => {
    // 如果有 Token，自动添加到请求头（登录成功后存储的 Token）
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  //失败回调，当请求在发送前就出现错误时触发
  (error) => {
    // 请求发送前的错误（如参数错误）
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 只返回响应体中的 data 部分
    return response.data;
  },
  (error) => {
    // 统一错误提示
    if (error.response) {
      // 后端返回错误状态码（如 401/403/500）
      const status = error.response.status;
      const errorMsg = error.response.data?.message || "请求失败";

      if (status === 401) {
        // Token 过期或未授权：清除本地存储
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        message.error("登录已过期，请重新登录");
      } else {
        message.error(`错误 ${status}：${errorMsg}`);
      }
    } else if (error.request) {
      // 无响应（如网络中断、超时）
      message.error("网络异常，请检查连接");
    } else {
      // 其他错误（如请求配置错误）
      message.error("请求发生错误，请重试");
    }
    return Promise.reject(error); // 让调用方可以捕获错误
  }
);

export default api;
