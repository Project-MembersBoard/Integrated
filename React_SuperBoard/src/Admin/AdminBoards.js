import { Link } from 'react-router-dom';
import './Admins.css';

const AdminBoards = () => {
  return (
    <div className="admins-container">
      <header>
        <h1>게시판 관리</h1>
      </header>
      
      <div className="admins-menu">
        <div className="admin-menu-item">
          <Link to="/board/list" className="admin-menu-link">
            <div className="admin-menu-icon">📝</div>
            <h2>게시판</h2>
            <p>현재 운영 중인 게시판 목록 및 게시글 확인</p>
          </Link>
        </div>
        
        <div className="admin-menu-item">
          <Link to="/admin/boards/manage" className="admin-menu-link">
            <div className="admin-menu-icon">⚙️</div>
            <h2>게시판 생성/삭제</h2>
            <p>새로운 게시판 카테고리 생성 및 관리</p>
          </Link>
        </div>
        
        <div className="admin-menu-item">
          <Link to="/admin/boards/statistics" className="admin-menu-link">
            <div className="admin-menu-icon">📊</div>
            <h2>게시글 통계</h2>
            <p>게시글 작성 추이, 인기글, 사용자 활동 통계</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminBoards;