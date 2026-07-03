/**
 * 关于我组件
 * 卡片式布局，左侧文字，右侧图标列表
 * 使用毛玻璃效果和圆角卡片
 */

import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { aboutData } from '../data/mockData';

const AboutSection = styled.section`
  padding: ${theme.spacing['4xl']} ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  letter-spacing: -0.5px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 28px;
    margin-bottom: ${theme.spacing.xl};
  }
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['2xl']};
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadowMedium};
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};

  &:hover {
    box-shadow: ${theme.shadowHeavy};
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
    padding: ${theme.spacing.xl};
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.lg};
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.bgPrimary};
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};

  &:hover {
    background: rgba(99, 102, 241, 0.04);
    transform: translateX(4px);
  }
`;

const HighlightIcon = styled.span`
  font-size: 24px;
  line-height: 1;
`;

const HighlightLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
`;

const ImageContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadowMedium};
  transition: ${theme.transitions.default};

  &:hover {
    transform: scale(1.02);
    box-shadow: ${theme.shadowHeavy};
  }
`;

export default function About() {
  return (
    <AboutSection id="about">
      <SectionTitle>{aboutData.title}</SectionTitle>
      <Card>
        <TextContent>
          <Description>{aboutData.description}</Description>
          <HighlightsGrid>
            {aboutData.highlights.map((item, index) => (
              <HighlightItem key={index}>
                <HighlightIcon>{item.icon}</HighlightIcon>
                <HighlightLabel>{item.label}</HighlightLabel>
              </HighlightItem>
            ))}
          </HighlightsGrid>
        </TextContent>
        <ImageContent>
          <StyledImage src={aboutData.image} alt="工作场景" />
        </ImageContent>
      </Card>
    </AboutSection>
  );
}
