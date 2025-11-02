import { Link, Outlet, useLocation, useAppData } from "umi";
import { ProLayout } from "@ant-design/pro-components";

export default function Layout() {
  const { clientRoutes } = useAppData();
  const location = useLocation();
  return (
    <ProLayout
      title="Login Edge"
      //默认渲染第一个页面
      route={clientRoutes[0]}
      location={location}
      // 控制布局是否显示加载状态（如骨架屏），实际项目中通常从 redux/dva 等状态管理库获取该值
      loading={false}
      // 所有页面的排列方式，可选值有 side 和 top 和 mix
      layout="top"
      menuItemRender={(menuItemProps, defaultDom) => {
        //如果是外部链接或者有子组件，则不做 Link 处理
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        //如果当前路径和菜单路径不相等，则进行 Link 包裹
        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
          return (
            <Link to={menuItemProps.path} target={menuItemProps.target}>
              {defaultDom}
            </Link>
          );
        }
        //否则返回默认 dom
        return defaultDom;
      }}
    >
      <Outlet />
    </ProLayout>
  );
}
