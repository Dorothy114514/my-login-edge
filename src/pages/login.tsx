import React from "react";
import styles from "./login.less";
import { Button, Input, Checkbox, Form, message } from "antd";
import { connect } from "umi";
import { useEffect } from "react";

const LoginPage = (props: any) => {
  //如果用户取消勾选RememberMe，立刻删除存储的账号密码
  useEffect(() => {
    if (!props.user.rememberMe) {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("rememberMe");
    }
  }, [props.user.rememberMe]);
  //本地存储输入的用户账号和密码
  const [form] = Form.useForm();
  //回调函数
  const onFinish = (values: any) => {
    console.log(values);
    props.dispatch({ type: "user/login", payload: { form: values } });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      initialValues={{
        username: localStorage.getItem("username") || "",
        password: localStorage.getItem("password") || "",
      }}
      className={styles.loginContainer}
      name="loginForm"
      onFinish={onFinish}
    >
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input name="username" placeholder="Username" autoComplete="username" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password
          name="password"
          placeholder="Password"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox
          checked={props.user.rememberMe}
          onChange={(e) =>
            props.dispatch({
              type: "user/setRememberMe",
              payload: e.target.checked,
            })
          }
        >
          Remember me
        </Checkbox>
      </Form.Item>

      <Form.Item className={styles.button}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          loading={props.user.loginLoading}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
export default connect(({ user }) => ({ user }))(LoginPage);
