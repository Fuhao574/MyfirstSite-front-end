/**
 * 技能展示组件
 * 网格卡片布局，包含图标、技能名称、圆角进度条
 */

import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { skillsData } from '../data/mockData';

const SkillsSection = styled.section`
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

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const SkillCard = styled.div`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadowLight};
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: ${theme.transitions.default};
  cursor: default;

  &:hover {
    box-shadow: ${theme.shadowMedium};
    transform: translateY(-4px);
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const SkillIcon = styled.span`
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bgPrimary};
  border-radius: ${theme.borderRadius.md};
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  margin-bottom: 2px;
`;

const SkillLevel = styled.span`
  font-size: 13px;
  color: ${theme.colors.textTertiary};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.colors.bgTertiary};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: ${({ color }) => color};
  border-radius: ${theme.borderRadius.full};
  transition: width 1.2s cubic-bezier(0.25, 0.1, 0.25, 1.0);
  opacity: 0.8;
`;

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <SkillsSection id="skills" ref={sectionRef}>
      <SectionTitle>技能专长</SectionTitle>
      <SectionSubtitle>熟练掌握的技术栈与工具</SectionSubtitle>
      <SkillsGrid>
        {skillsData.map((skill) => (
          <SkillCard key={skill.id}>
            <SkillHeader>
              <SkillIcon>{skill.icon}</SkillIcon>
              <SkillInfo>
                <SkillName>{skill.name}</SkillName>
                <SkillLevel>{skill.proficiency}% 熟练度</SkillLevel>
              </SkillInfo>
            </SkillHeader>
            <ProgressBarContainer>
              <ProgressBarFill
                width={isVisible ? skill.proficiency : 0}
                color={skill.color}
              />
            </ProgressBarContainer>
          </SkillCard>
        ))}

        {/* 听歌时长 - 小卡片（内容少） */}
        <SkillCard>
          <SkillHeader>
            <SkillIcon>🎵</SkillIcon>
            <SkillInfo>
              <SkillName>听歌时长</SkillName>
              <SkillLevel>本月累计</SkillLevel>
            </SkillInfo>
          </SkillHeader>
          <ProgressBarContainer>
            <ProgressBarFill width={isVisible ? 42 : 0} color="#EC4899" />
          </ProgressBarContainer>
        </SkillCard>

        {/* 当月预算 - 小卡片 */}
        <SkillCard>
          <SkillHeader>
            <SkillIcon>💳</SkillIcon>
            <SkillInfo>
              <SkillName>当月预算</SkillName>
              <SkillLevel>66% 已使用 · 剩余 ¥1,720</SkillLevel>
            </SkillInfo>
          </SkillHeader>
          <ProgressBarContainer>
            <ProgressBarFill width={isVisible ? 66 : 0} color="#3B82F6" />
          </ProgressBarContainer>
        </SkillCard>
      </SkillsGrid>
    </SkillsSection>
  );
}
