/**
 * 主页 - 空白页面
 */

import { PageContainer, Content, EmptyState } from './PageContainer';

export default function Home() {
  return (
    <PageContainer>
      <Content>
        <EmptyState>
          <h2>主页</h2>
          <p>页面建设中...</p>
        </EmptyState>
      </Content>
    </PageContainer>
  );
}
