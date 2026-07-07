/**
 * App 主组件
 * 单页结构：Navbar + Hero（全部内容在一页）
 */
import { useState } from 'react';
import styled from '@emotion/styled';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WelcomePage from './components/WelcomePage';

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  const [entered, setEntered] = useState(false);

  if (!entered) {
    return (
      <AppContainer>
        <WelcomePage onEnter={() => setEntered(true)} />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Navbar />
      <Hero />
    </AppContainer>
  );
}

export default App;