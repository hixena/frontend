import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import  createUploadLink  from 'apollo-upload-client/createUploadLink.mjs';

export const client = new ApolloClient({
  link: createUploadLink({
    uri: 'http://localhost:3000/graphql',
    headers: {
      'apollo-require-preflight': 'true'
    }
  }),
  cache: new InMemoryCache()
});

// GraphQL 查询定义
const EXPORT_USERS_QUERY = gql`
  query ExportUsersToExcel {
    exportUsersToExcel
  }
`;

const IMPORT_USERS_MUTATION = gql`
  mutation ImportUsersFromExcel($file: Upload!) {
    importUsersFromExcel(file: $file) {
      errors
      failedCount
      successCount
    }
  }
`;

// 导出用户数据
export const exportUsersToExcel = async () => {
  try {
    const exportResponse = await client.query({
      query: EXPORT_USERS_QUERY
    });

    const downloadPath = exportResponse.data?.exportUsersToExcel;
    if (!downloadPath) throw new Error('导出失败: 未获取到下载路径');

    const fullDownloadUrl = `http://localhost:3000${downloadPath}`;
    const response = await fetch(fullDownloadUrl);
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadPath.split('/').pop() || '用户数据.xlsx';
    a.click();
    
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('导出失败:', error);
    throw error;
  }
};

// 导入用户数据（修复版）
export const importUsersFromExcel = async (file: File) => {
  try {
    const response = await client.mutate({
      mutation: IMPORT_USERS_MUTATION,
      variables: { file },
      // 不需要手动设置Content-Type，createUploadLink会自动处理
    });

    return response.data?.importUsersFromExcel || {
      successCount: 0,
      failedCount: 1,
      errors: ['未获取到导入结果']
    };
  } catch (error) {
    console.error('导入失败:', error);
    throw error;
  }
};