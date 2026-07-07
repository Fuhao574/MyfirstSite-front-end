/**
 * 页面布局组件 - 导航栏 + 页面内容
 */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackToTop from '../components/BackToTop';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BackToTop />
    </>
  );
}