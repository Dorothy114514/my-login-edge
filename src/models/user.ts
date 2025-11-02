import Password from "antd/es/input/Password";
import api from "@/utils/request";
import { history } from "umi";
import { message } from "antd";
//只存 “必须跨组件共享” 或 “需要在异步逻辑（effects）中处理” 的状态
//对于 响应式需求的状态，优先考虑使用 useState 或 useModel 来管理
export default {
  namespace: "user",
  //定义全局状态
  state: {
    token: null,
    loginError: null,
    rememberMe: localStorage.getItem("rememberMe") === "true",
    //是否已经登录
    isLogin: false,
    //登录加载状态
    loginLoading: false,
  },
  //处理异步逻辑
  //effects输出Dva中处理副作用的地方，比如接口请求，弹窗和路由跳转等
  effects: {
    // 登录逻辑（* 表示 Generator 函数）
    // 参数1：{ payload } 接收组件传递的参数（如账号、密码）
    // 参数2：{ call, put, select } 工具函数（call 调用接口，put 触发 reducer，select 获取当前 state）
    *login(
      { payload }: any,
      { call, put, select }: any
    ): Generator<any, void, any> {
      // 调用登录接口（POST 方式，参数放在请求体中）
      try {
        const result = yield call(api.post, "/login", {
          Name: payload.form.username, // 后端要求的参数名是 Name
          Pwd: payload.form.password, // 后端要求的参数名是 Pwd
        });

        // 登录成功
        //返回字段包括data 和 code
        if (Number(result.code) === 200) {
          // 存储 Token
          yield put({ type: "setToken", payload: result.data.token });
          yield put({ type: "setIsLogin", payload: true });
          yield put({ type: "setLoginError", payload: null });
          // 如果登录成功且选择记住我，则将账号密码存储到 localStorage
          if (payload.rememberMe) {
            localStorage.setItem("username", payload.form.username);
            localStorage.setItem("password", payload.form.password);
            localStorage.setItem("rememberMe", "true");
          }
          alert("登录成功");
          //路由跳转,命令式跳转请使用 history API
          //组件内还可以使用 useNavigate hook
          history.push("/docs");
          message.success("登录成功");
        } else {
          // 后端返回业务错误
          yield put({
            type: "setLoginError",
            payload: result.data.message || "未知错误",
            //事实上这个错误没有被定义
          });
          message.error("登录失败");
        }
      } catch (error: any) {
        // 错误已在响应拦截器中处理，这里只需捕获异常即可
        yield put({
          type: "setLoginError",
          payload: error.message || "账号密码错误",
        });
        message.error("登录失败");
      } finally {
        //无论登录成功失败与否都要将加载状态设为 false
        yield put({ type: "setLoginLoading", payload: false });
      }
    },
  },
  //同步更新 state 的方法
  reducers: {
    // 这里可以添加其他的 reducers 来处理 state 的更新
    setRememberMe(state: any, action: any) {
      localStorage.setItem("rememberMe", action.payload);
      return {
        ...state,
        rememberMe: action.payload,
      };
    },
    setToken(state: any, action: any) {
      return {
        ...state,
        token: action.payload,
      };
    },
    setLoginError(state: any, action: any) {
      return {
        ...state,
        loginError: action.payload,
      };
    },
    setIsLogin(state: any, action: any) {
      return {
        ...state,
        isLogin: action.payload,
      };
    },
    setLoginLoading(state: any, action: any) {
      return {
        ...state,
        loginLoading: action.payload,
      };
    },
  },
};
