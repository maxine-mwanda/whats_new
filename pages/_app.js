import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import Layout from '../components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Layout>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;