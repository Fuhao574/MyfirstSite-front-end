/**
 * 天气卡片组件
 * 渐变背景 + 光斑风格
 * 使用 Open-Meteo 免费 API 获取上海当前天气
 * 每 10 分钟自动刷新
 */

import { useState, useEffect, useCallback } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Wind,
  Droplets,
  MapPin,
  Loader2,
  RefreshCw,
  Thermometer,
} from 'lucide-react';

/* 动画 */
const cardEnter = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

/* ============================================
   Open-Meteo API 配置
   上海坐标：latitude=31.23, longitude=121.47
   ============================================ */
const WEATHER_API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=31.23&longitude=121.47&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Shanghai';

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 分钟

/* 天气数据类型 */
interface WeatherData {
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
}

/* ============================================
   weather_code 映射
   0=晴, 1-3=多云, 45-48=雾, 51-67=雨,
   71-77=雪, 80-82=阵雨, 95-99=雷暴
   ============================================ */
const getWeatherInfo = (code: number): { description: string; icon: typeof Sun } => {
  if (code === 0) return { description: '晴', icon: Sun };
  if (code >= 1 && code <= 3) return { description: '多云', icon: Cloud };
  if (code >= 45 && code <= 48) return { description: '雾', icon: CloudFog };
  if (code >= 51 && code <= 67) return { description: '雨', icon: CloudRain };
  if (code >= 71 && code <= 77) return { description: '雪', icon: CloudSnow };
  if (code >= 80 && code <= 82) return { description: '阵雨', icon: CloudRain };
  if (code >= 95 && code <= 99) return { description: '雷暴', icon: CloudLightning };
  return { description: '未知', icon: Cloud };
};

/* ============================================
   统一卡片样式
   ============================================ */
const WeatherWrapper = styled.div`
  background: ${theme.card.bg};
  border: ${theme.card.border};
  border-radius: ${theme.card.radius};
  padding: ${theme.card.padding};
  box-shadow: ${theme.card.shadow};
  position: relative;
  overflow: hidden;

  animation: ${cardEnter} 0.6s 0.1s cubic-bezier(0.25, 0.1, 0.25, 1.0) both;
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.card.shadowHover};
  }
`;

const WeatherHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
  padding-left: 4px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const LocationIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`;

const LocationTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.3px;
`;

const WeatherIconWrap = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.accentBlue};

  svg {
    width: 36px;
    height: 36px;
    stroke-width: 1.8;
  }
`;

/* 主体内容 */
const WeatherBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-left: 4px;
  margin-bottom: ${theme.spacing.md};
`;

const TemperatureBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Temperature = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  line-height: 1;
  letter-spacing: -1.5px;
  display: flex;
  align-items: flex-start;

  span {
    font-size: 20px;
    font-weight: 600;
    margin-top: 4px;
    margin-left: 2px;
    color: ${theme.colors.textSecondary};
  }
`;

const WeatherDescription = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  letter-spacing: -0.2px;
`;

const ApparentTemp = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${theme.colors.textTertiary};
  margin-top: 2px;

  svg {
    width: 13px;
    height: 13px;
  }
`;

/* 底部信息条 */
const WeatherFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.xs};
  padding-left: 4px;
  border-top: 1px solid ${theme.colors.bgTertiary};
  margin-top: ${theme.spacing.xs};
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};

  svg {
    width: 15px;
    height: 15px;
    color: ${theme.colors.accentBlue};
    stroke-width: 2;
  }
`;

/* 加载中 */
const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl} 0;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.textTertiary};
  font-size: 13px;
`;

const Spinner = styled(Loader2)`
  width: 28px;
  height: 28px;
  color: ${theme.colors.accentBlue};
  animation: ${spin} 0.8s linear infinite;
`;

/* 错误状态 */
const ErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg} 0;
  gap: ${theme.spacing.sm};
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: ${theme.colors.textTertiary};
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.bgTertiary};
  color: ${theme.colors.accentBlue};
  font-size: 13px;
  font-weight: 600;
  transition: ${theme.transitions.fast};

  &:hover {
    background: rgba(99, 102, 241, 0.14);
    transform: scale(1.04);
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* ============================================
   组件
   ============================================ */
export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(WEATHER_API_URL);
      if (!res.ok) throw new Error('网络响应异常');
      const data = await res.json();
      const current = data?.current;
      if (!current) throw new Error('数据格式异常');

      setWeather({
        temperature: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        apparentTemperature: Math.round(current.apparent_temperature),
        weatherCode: current.weather_code,
        windSpeed: Math.round(current.wind_speed_10m),
      });
    } catch (err) {
      console.error('获取天气数据失败:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /* 初始化 + 每 10 分钟自动刷新 */
  useEffect(() => {
    fetchWeather();
    const timer = setInterval(fetchWeather, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchWeather]);

  return (
    <WeatherWrapper>
      <WeatherHeader>
        <HeaderLeft>
          <LocationIcon>
            <MapPin />
          </LocationIcon>
          <LocationTitle>上海</LocationTitle>
        </HeaderLeft>
        {weather && !loading && !error && (() => {
          const { icon: WeatherIcon } = getWeatherInfo(weather.weatherCode);
          return (
            <WeatherIconWrap>
              <WeatherIcon />
            </WeatherIconWrap>
          );
        })()}
      </WeatherHeader>

      {loading && (
        <LoadingBox>
          <Spinner />
          <span>正在获取天气…</span>
        </LoadingBox>
      )}

      {!loading && error && (
        <ErrorBox>
          <ErrorText>天气数据加载失败</ErrorText>
          <RetryButton onClick={fetchWeather}>
            <RefreshCw />
            重试
          </RetryButton>
        </ErrorBox>
      )}

      {!loading && !error && weather && (() => {
        const { description } = getWeatherInfo(weather.weatherCode);
        return (
          <>
            <WeatherBody>
              <TemperatureBlock>
                <Temperature>
                  {weather.temperature}
                  <span>°C</span>
                </Temperature>
                <WeatherDescription>{description}</WeatherDescription>
                <ApparentTemp>
                  <Thermometer />
                  体感 {weather.apparentTemperature}°C
                </ApparentTemp>
              </TemperatureBlock>
            </WeatherBody>

            <WeatherFooter>
              <FooterItem>
                <Droplets />
                湿度 {weather.humidity}%
              </FooterItem>
              <FooterItem>
                <Wind />
                风速 {weather.windSpeed} km/h
              </FooterItem>
            </WeatherFooter>
          </>
        );
      })()}
    </WeatherWrapper>
  );
}
