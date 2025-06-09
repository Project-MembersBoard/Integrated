import { useOutletContext } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BoardManagement.css';

const BoardManagement = () => {
  const { isAdmin } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdminAuthAndFetch = async () => {
      if (!isAdmin) {
        setError('관리자만 접근할 수 있습니다.');
        setLoading(false);
        return;
      }

      try {
        await fetchCategories();
      } catch (error) {
        console.error("인증 또는 데이터 불러오기 오류:", error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuthAndFetch();
  }, [isAdmin]);

  const fetchCategories = async () => {
    const response = await axios.get('/api/board/categories', { withCredentials: true });
    setCategories(response.data);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await axios.post('/api/board/categories', { name: newCategory }, { withCredentials: true });
      setNewCategory('');
      await fetchCategories();
    } catch (error) {
      console.error("카테고리 생성 오류:", error);
      alert('카테고리 생성 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('이 카테고리를 삭제하시겠습니까? 관련 게시글은 영향을 받지 않습니다.')) return;

    try {
      await axios.delete(`/api/board/categories/${categoryId}`, { withCredentials: true });
      await fetchCategories();
    } catch (error) {
      console.error("카테고리 삭제 오류:", error);
      alert('카테고리 삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className="board-management-container">로딩 중...</div>;
  if (error) return <div className="board-management-container">{error}</div>;

  return (
    <div className="board-management-container">
      <header>
        <h1>게시판 카테고리 관리</h1>
      </header>

      <div className="management-content">
        <div className="create-category">
          <h2>새 카테고리 생성</h2>
          <form onSubmit={handleCreateCategory} className="category-form">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="카테고리 이름"
              required
            />
            <button type="submit">생성</button>
          </form>
        </div>

        <div className="category-list">
          <h2>카테고리 목록</h2>
          {categories.length > 0 ? (
            <table className="categories-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>카테고리 이름</th>
                  <th>게시글 수</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.postCount || 0}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>카테고리가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardManagement;
