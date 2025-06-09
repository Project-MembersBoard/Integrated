import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-container">
      <header>
        <h1>관리자 페이지</h1>
      </header>
      
      <div className="admin-menu-container">
        <div className="admin-menu-item">
          <Link to="/admin/members" className="admin-menu-link">
            <div className="admin-menu-icon">👥</div>
            <h2>회원 관리</h2>
            <p>사용자 계정 관리, 권한 설정 및 활동 모니터링</p>
          </Link>
        </div>
        
        <div className="admin-menu-item">
          <Link to="/admin/boards" className="admin-menu-link">
            <div className="admin-menu-icon">📋</div>
            <h2>게시판 관리</h2>
            <p>게시판 생성/삭제, 게시글 통계 및 모니터링</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;