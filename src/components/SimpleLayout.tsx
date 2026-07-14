/**
 * 简单布局 - 只有导航栏 + 页面内容（无右侧栏）
 * 用于 About 等不需要侧边栏的页面
 */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackToTop from '../components/BackToTop';

export default function SimpleLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BackToTop />
    </>
  );
}
