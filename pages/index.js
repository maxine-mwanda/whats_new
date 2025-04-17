import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Input, Button, Card, Spin, Pagination, Empty, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import api from '../utils/api';

const { Search } = Input;

const HomePage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts', {
        params: { page, limit: 6, search }
      });
      setPosts(data.posts);
      setTotalPosts(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(
      router.query.page ? parseInt(router.query.page) : 1,
      router.query.search || ''
    );
  }, [router.query]);

  const handleSearch = (value) => {
    router.push({
      pathname: '/',
      query: { ...router.query, search: value, page: 1 }
    });
  };

  const handlePageChange = (page) => {
    router.push({
      pathname: '/',
      query: { ...router.query, page }
    });
  };

  return (
    <Layout>
      <Head>
        <title>Blog Website - Latest Posts</title>
        <meta name="description" content="Read our latest blog posts" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Blog</h1>
          <p className="text-lg text-gray-600">
            Discover insightful articles and stay updated with our latest posts
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Search
            placeholder="Search posts..."
            allowClear
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                Search
              </Button>
            }
            size="large"
            className="max-w-2xl w-full"
            onSearch={handleSearch}
            defaultValue={router.query.search}
          />
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <Spin size="large" />
          </div>
        ) : posts.length === 0 ? (
          <Empty
            description={
              searchQuery
                ? `No posts found for "${searchQuery}"`
                : 'No posts available'
            }
            className="my-12"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  hoverable
                  cover={
                    <img
                      alt={post.title}
                      src={post.featured_image || '/images/default-post.jpg'}
                      className="h-48 object-cover"
                    />
                  }
                  className="h-full flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags?.map((tag) => (
                        <Tag key={tag.id} color="blue">
                          {tag.name}
                        </Tag>
                      ))}
                    </div>
                    <Link href={`/posts/${post.slug}`}>
                      <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Link href={`/categories/${post.category.slug}`}>
                      <span className="text-sm text-primary hover:underline cursor-pointer">
                        {post.category.name}
                      </span>
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={totalPosts}
                pageSize={6}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;