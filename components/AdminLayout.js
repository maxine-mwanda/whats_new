import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Badge,
  message,
  theme
} from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  FolderOutlined,
  TagsOutlined,
  CommentOutlined,
  UserOutlined,
  PictureOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  if (!session || session.user.role !== 'admin') {
    router.push('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      message.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      message.error('Error logging out');
    }
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Profile',
          icon: <UserOutlined />
        },
        {
          key: '2',
          label: 'Logout',
          icon: <LogoutOutlined />,
          onClick: handleLogout
        }
      ]}
    />
  );

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div className="h-12 m-4 flex items-center justify-center bg-white rounded">
          <h1 className="text-xl font-bold text-primary">
            {collapsed ? 'BP' : 'BlogPanel'}
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[router.pathname]}
          items={[
            {
              key: '/admin/dashboard',
              icon: <DashboardOutlined />,
              label: <Link href="/admin/dashboard">Dashboard</Link>
            },
            {
              key: '/admin/posts',
              icon: <FileOutlined />,
              label: <Link href="/admin/posts">Posts</Link>
            },
            {
              key: '/admin/categories',
              icon: <FolderOutlined />,
              label: <Link href="/admin/categories">Categories</Link>
            },
            {
              key: '/admin/tags',
              icon: <TagsOutlined />,
              label: <Link href="/admin/tags">Tags</Link>
            },
            {
              key: '/admin/comments',
              icon: <CommentOutlined />,
              label: (
                <Link href="/admin/comments">
                  <Space>
                    <span>Comments</span>
                    <Badge count={5} size="small" />
                  </Space>
                </Link>
              )
            },
            {
              key: '/admin/media',
              icon: <PictureOutlined />,
              label: <Link href="/admin/media">Media</Link>
            },
            {
              key: '/admin/users',
              icon: <UserOutlined />,
              label: <Link href="/admin/users">Users</Link>
            },
            {
              key: '/admin/analytics',
              icon: <BarChartOutlined />,
              label: <Link href="/admin/analytics">Analytics</Link>
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer }}
          className="flex items-center justify-between p-0 px-4"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="w-12 h-12"
          />
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar
                src={session.user.image}
                icon={<UserOutlined />}
                className="mr-2"
              />
              <span className="font-medium">{session.user.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: 8
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;