/**
 * 博客 - 左侧内容
 * 右侧栏由 Layout 统一提供
 * 支持文章列表 + 文章详情（通过路由 /blog/:postId）
 */

import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { blogPosts } from '../data/blogData';

/* ============================================
   文章卡片
   ============================================ */
const BlogCard = styled.article`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: ${theme.card.shadow};
  overflow: hidden;
  transition: ${theme.transitions.default};
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.card.shadowHover};
  }
`;

const BlogCover = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${BlogCard}:hover & img {
    transform: scale(1.05);
  }
`;

const BlogBody = styled.div`
  padding: 20px 24px;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: ${theme.colors.textTertiary};
  margin-bottom: 10px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const BlogCategory = styled.span`
  padding: 2px 10px;
  background: ${theme.colors.accentBlue}15;
  color: ${theme.colors.accentBlue};
  border-radius: 9999px;
  font-weight: 600;
  font-size: 11px;
`;

const BlogTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0 0 8px;
  line-height: 1.4;
`;

const BlogExcerpt = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const BlogTag = styled.span`
  padding: 2px 8px;
  background: #f3f6fa;
  color: ${theme.colors.textSecondary};
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
`;

/* ============================================
   文章详情
   ============================================ */
const ArticleDetail = styled.article`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  box-shadow: ${theme.card.shadow};
  overflow: hidden;
`;

const ArticleCover = styled.div`
  width: 100%;
  height: 280px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ArticleBody = styled.div`
  padding: 32px 36px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 24px 20px;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: ${theme.colors.textTertiary};
  margin-bottom: 16px;
`;

const ArticleTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  margin: 0 0 20px;
  line-height: 1.3;
`;

const ArticleContent = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: ${theme.colors.textPrimary};

  h2 {
    font-size: 22px;
    font-weight: 700;
    margin: 28px 0 12px;
    color: ${theme.colors.textPrimary};
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin: 22px 0 10px;
    color: ${theme.colors.textPrimary};
  }

  p {
    margin: 0 0 14px;
  }

  ul, ol {
    margin: 0 0 14px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 6px;
  }

  code {
    padding: 2px 6px;
    background: #f3f6fa;
    border-radius: 4px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    color: #d6336c;
  }

  pre {
    padding: 16px 20px;
    background: #f8f9fa;
    border-radius: 12px;
    overflow-x: auto;
    margin: 0 0 14px;

    code {
      padding: 0;
      background: none;
      color: ${theme.colors.textPrimary};
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 14px;
    font-size: 14px;

    th, td {
      padding: 10px 14px;
      border: 1px solid #e3e8ee;
      text-align: left;
    }

    th {
      background: #f8f9fa;
      font-weight: 700;
    }
  }

  blockquote {
    margin: 0 0 14px;
    padding: 12px 20px;
    border-left: 4px solid ${theme.colors.accentBlue};
    background: ${theme.colors.accentBlue}08;
    border-radius: 0 8px 8px 0;
    color: ${theme.colors.textSecondary};
    font-style: italic;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  transition: ${theme.transitions.default};
  margin-bottom: 16px;

  &:hover {
    color: ${theme.colors.textPrimary};
    transform: translateX(-2px);
  }
`;

/* ============================================
   简易 Markdown 渲染
   ============================================ */
function renderMarkdown(content: string): string {
  return content
    // 表格
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => /^[\s-:]+$/.test(c))) return '';
      return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table>$1</table>')
    // 标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 引用
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // 列表
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    // 段落
    .split('\n\n')
    .map(block => {
      if (block.match(/^<(h\d|ul|table|blockquote|pre)/)) return block;
      if (block.trim() === '') return '';
      return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

/* ============================================
   组件
   ============================================ */
export default function Blog() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  // 有 postId → 文章详情
  if (postId) {
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
      return (
        <ArticleDetail>
          <ArticleBody>
            <ArticleTitle>文章不存在</ArticleTitle>
            <p>找不到该博客文章。</p>
          </ArticleBody>
        </ArticleDetail>
      );
    }

    return (
      <>
        <BackButton onClick={() => navigate('/blog')}>
          ← 返回列表
        </BackButton>
        <ArticleDetail>
          {post.cover && (
            <ArticleCover>
              <img src={post.cover} alt={post.title} />
            </ArticleCover>
          )}
          <ArticleBody>
            <ArticleMeta>
              <BlogCategory>{post.category}</BlogCategory>
              <span>{post.date}</span>
              <span>· {post.readTime} 分钟阅读</span>
            </ArticleMeta>
            <ArticleTitle>{post.title}</ArticleTitle>
            <ArticleContent dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
          </ArticleBody>
        </ArticleDetail>
      </>
    );
  }

  // 无 postId → 文章列表
  return (
    <>
      {blogPosts.map((post) => (
        <BlogCard key={post.id} onClick={() => navigate(`/blog/${post.id}`)}>
          {post.cover && (
            <BlogCover>
              <img src={post.cover} alt={post.title} />
            </BlogCover>
          )}
          <BlogBody>
            <BlogMeta>
              <BlogCategory>{post.category}</BlogCategory>
              <span>{post.date}</span>
              <span>· {post.readTime} 分钟阅读</span>
            </BlogMeta>
            <BlogTitle>{post.title}</BlogTitle>
            <BlogExcerpt>{post.excerpt}</BlogExcerpt>
            <BlogTags>
              {post.tags.map(tag => (
                <BlogTag key={tag}>{tag}</BlogTag>
              ))}
            </BlogTags>
          </BlogBody>
        </BlogCard>
      ))}
    </>
  );
}
