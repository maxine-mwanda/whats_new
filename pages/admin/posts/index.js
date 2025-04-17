import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  message,
  Badge,
  Tooltip
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';
import api from '../../../utils/api';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PostsPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: []
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link href={`/admin/posts/edit/${record.id}`}>
          <a className="font-medium hover:text-primary">{text}</a>
        </Link>
      )
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author?.username
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category?.name
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'published':
            color = 'green';
            break;
          case 'draft':
            color = 'orange';
            break;
          case 'archived':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Published At',
      dataIndex: 'published_at',
      key: 'published_at',
      render: (date) => (date ? new Date(date).toLocaleDateString() : '-')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              onClick={() => router.push(`/posts/${record.slug}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => router.push(`/admin/posts/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const fetchPosts = async (params = {}) => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/posts', {
        params: {
          page: params.pagination?.current || pagination.current,
          limit: params.pagination?.pageSize || pagination.pageSize,
          status: filters.status,
          search: filters.search,
          startDate: filters.dateRange?.[0]?.toISOString(),
          endDate: filters.dateRange?.[1]?.toISOString()
        }
      });

      setPosts(data.posts);
      setPagination({
        ...pagination,
        total: data.total,
        current: params.pagination?.current || 1
      });
    } catch (error) {
      message.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleTableChange = (newPagination) => {
    fetchPosts({ pagination: newPagination });
  };

  const handleStatusFilter = (value) => {
    setFilters({ ...filters, status: value });
  };

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
  };

  const handleDateChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/posts/${id}`);
      message.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      message.error('Failed to delete post');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Posts Management</h1>
        <Link href="/admin/posts/new">
          <Button type="primary" icon={<PlusOutlined />}>
            New Post
          </Button>
        </Link>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <Space size="large">
          <Search
            placeholder="Search posts..."
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={handleSearch}
            className="w-64"
          />

          <Select
            placeholder="Filter by status"
            allowClear
            onChange={handleStatusFilter}
            className="w-40"
          >
            <Option value="published">Published</Option>
            <Option value="draft">Draft</Option>
            <Option value="archived">Archived</Option>
          </Select>

          <RangePicker onChange={handleDateChange} />
        </Space>
      </div>

      <Table
        columns={columns}
        rowKey="id"
        dataSource={posts}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </AdminLayout>
  );
};

export default PostsPage;