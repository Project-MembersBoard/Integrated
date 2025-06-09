import { Link } from 'react-router-dom';
import './Admins.css';

const AdminMember = () => {
  return (
    <div className="admins-container">
      <header>
        <h1>회원 관리</h1>
      </header>
      
      <div className="admins-menu">
        <div className="admin-menu-item">
          <Link to="/userinfoprint" className="admin-menu-link">
            <div className="admin-menu-icon">📝</div>
            <h2>회원 조회</h2>
            <p>회원 목록 및 회원 검색</p>
          </Link>
        </div>
        
        <div className="admin-menu-item">
          <Link to="/userstatics" className="admin-menu-link">
            <div className="admin-menu-icon">📊</div>
            <h2>회원 통계</h2>
            <p>가입자 수 추이, 활성/비활성 회원 비율, 월별 가입자 통계</p>
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default AdminMember;