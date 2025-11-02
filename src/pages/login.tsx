import React from "react";
import styles from "./login.less";
import { Button, Input, Checkbox, Form } from "antd";
import { connect } from "umi";

const LoginPage = () => {
  const onFinish = () => {
    // Handle login logic here
  };

  return (
    <Form
      className={styles.loginContainer}
      name="loginForm"
      onFinish={onFinish}
      initialValues={{ remember: true }}
    >
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input placeholder="Username" autoComplete="username" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password
          placeholder="Password"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className={styles.button}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
export default LoginPage;
