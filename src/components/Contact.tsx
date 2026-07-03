/**
 * 联系区组件
 * 社交图标链接 + 简约联系表单
 * 毛玻璃卡片风格
 */

import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { socialLinks } from '../data/mockData';
import { Github, Twitter, Linkedin, Mail, Send, CheckCircle } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={22} />,
  twitter: <Twitter size={22} />,
  linkedin: <Linkedin size={22} />,
  mail: <Mail size={22} />,
};

const ContactSection = styled.section`
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing['2xl']};
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
  }
`;

const SocialCard = styled.div`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadowMedium};
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.lg};
`;

const SocialTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const SocialLink = styled.a`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.bgPrimary};
  color: ${theme.colors.textSecondary};
  transition: ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.accentBlue};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
  }
`;

const FormCard = styled.div`
  background: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['2xl']};
  box-shadow: ${theme.shadowMedium};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: 15px;
  font-family: inherit;
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.bgPrimary};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: ${theme.borderRadius.md};
  outline: none;
  transition: ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    border-color: ${theme.colors.accentBlue};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: 15px;
  font-family: inherit;
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.bgPrimary};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: ${theme.borderRadius.md};
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }

  &:focus {
    border-color: ${theme.colors.accentBlue};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
  color: white;
  background: ${theme.colors.gradientBlue};
  border-radius: ${theme.borderRadius.md};
  transition: ${theme.transitions.fast};
  opacity: 0.9;
  margin-top: ${theme.spacing.sm};

  &:hover {
    opacity: 1;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  color: ${theme.colors.accentTeal};
  background: rgba(20, 184, 166, 0.08);
  border-radius: ${theme.borderRadius.md};
  font-size: 15px;
  font-weight: 500;
`;

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟表单提交
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <ContactSection id="contact">
      <SectionTitle>联系我</SectionTitle>
      <SectionSubtitle>期待与你的交流与合作</SectionSubtitle>
      <ContactGrid>
        <SocialCard>
          <SocialTitle>社交平台</SocialTitle>
          <SocialLinks>
            {socialLinks.map((link) => (
              <SocialLink
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
              >
                {iconMap[link.icon]}
              </SocialLink>
            ))}
          </SocialLinks>
        </SocialCard>

        <FormCard>
          {isSubmitted ? (
            <SuccessMessage>
              <CheckCircle size={20} />
              消息已发送，谢谢你的联系！
            </SuccessMessage>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="你的名字"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="邮箱地址"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <TextArea
                placeholder="留言内容..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <SubmitButton type="submit">
                <Send size={16} />
                发送消息
              </SubmitButton>
            </Form>
          )}
        </FormCard>
      </ContactGrid>
    </ContactSection>
  );
}
