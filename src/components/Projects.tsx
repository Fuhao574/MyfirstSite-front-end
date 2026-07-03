/**
 * 项目作品组件
 * 网格排列的项目卡片，包含封面、标题、描述、技术标签
 */

import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { projectsData } from '../data/mockData';
import { ExternalLink } from 'lucide-react';

const ProjectsSection = styled.section`
  padding: ${theme.spacing['4xl']} ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  text-align: center;
  margin-bottom: ${theme.spacing.sm};
  letter-spacing: -0.5px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 28px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing.xl};
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${theme.shadowLight};
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${theme.shadowHeavy};
    transform: translateY(-6px);

    .project-image {
      transform: scale(1.05);
    }
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.0);
`;

const CardContent = styled.div`
  padding: ${theme.spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.sm};
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${theme.spacing.md};
  flex: 1;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.accentBlue};
  background: rgba(99, 102, 241, 0.08);
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.full};
`;

const ViewButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding: ${theme.spacing.md};
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.bgSecondary};
  background: ${theme.colors.gradientBlue};
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  opacity: 0.9;

  &:hover {
    opacity: 1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export default function Projects() {
  return (
    <ProjectsSection id="projects">
      <SectionTitle>项目作品</SectionTitle>
      <SectionSubtitle>精选的开发项目与案例</SectionSubtitle>
      <ProjectsGrid>
        {projectsData.map((project) => (
          <ProjectCard key={project.id}>
            <ImageWrapper>
              <ProjectImage
                src={project.image}
                alt={project.title}
                className="project-image"
              />
            </ImageWrapper>
            <CardContent>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <TagsContainer>
                {project.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagsContainer>
              <ViewButton href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                查看详情
              </ViewButton>
            </CardContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsSection>
  );
}
