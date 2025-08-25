import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import App from './App';
import { client } from './Apollo/client'; // 注意路径大小写保持一致

async function initializeApp() {
  try {
    await client.clearStore();
  } catch (e) {
    console.error('缓存初始化失败:', e);
  }
}

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);
initializeApp().then(() => {
  root.render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
});