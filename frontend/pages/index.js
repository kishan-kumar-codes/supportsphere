import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Head>
        <title>SupportSphere</title>
        <meta name="description" content="SupportSphere - Your support solution" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to SupportSphere</h1>
        {error && <p>Error: {error}</p>}
        {data ? (
          <div>
            <h2>Data from API:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>

      <footer>
        <p>© 2023 SupportSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}