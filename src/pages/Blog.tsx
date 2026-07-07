/**
 * 博客 - 空白页面
 */

import { PageContainer, Content, EmptyState } from './PageContainer';

export default function Blog() {
  return (
    <PageContainer>
      <Content>
        <EmptyState>
          <h2>博客</h2>
          <p>页面建设中...</p>
        </EmptyState>
      </Content>
    </PageContainer>
  );
}
