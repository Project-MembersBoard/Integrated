import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './BoardWrite.css'; // Reuse the same CSS as BoardWrite

const BoardEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        tag: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/login/api/member/checkAuth', { withCredentials: true });
                if (!response.data.isLoggedIn) {
                    navigate('/login');
                } else {
                    fetchCategories();
                    fetchBoard();
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                navigate('/login');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/board/categories', { withCredentials: true });
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchBoard = async () => {
            try {
                const response = await axios.get(`/api/board/view/${id}`, { withCredentials: true });
                const board = response.data;
                
                // Check if current user is the author
                const authResponse = await axios.get('/login/api/member/checkAuth', { withCredentials: true });
                if (board.writer !== authResponse.data.userId) {
                    setError('자신이 작성한 글만 수정할 수 있습니다.');
                    navigate(`/board/view/${id}`);
                    return;
                }
                
                setFormData({
                    title: board.title,
                    content: board.content,
                    category: board.category || '',
                    tag: board.tag || ''
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching board:", error);
                setError('게시글을 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        checkAuth();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/board/update/${id}`, formData, { withCredentials: true });
            navigate(`/board/view/${id}`);
        } catch (error) {
            console.error("Error updating board:", error);
            if (error.response && error.response.status === 403) {
                setError('자신이 작성한 글만 수정할 수 있습니다.');
            } else {
                setError('게시글 수정 중 오류가 발생했습니다.');
            }
        }
    };

    if (loading) {
        return <div className="write-container">로딩 중...</div>;
    }

    if (error) {
        return <div className="write-container">{error}</div>;
    }

    return (
        <div className="write-container">
            <header>
                <h1>게시글 수정</h1>
            </header>
            
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            value={formData.title}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">카테고리</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">카테고리 선택</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tag">태그</label>
                        <input 
                            type="text" 
                            id="tag" 
                            name="tag" 
                            value={formData.tag}
                            onChange={handleChange}
                            placeholder="태그는 쉼표(,)로 구분해 주세요"
                        />
                        <small className="form-text">태그는 쉼표(,)로 구분해야 합니다</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">내용</label>
                        <textarea 
                            id="content" 
                            name="content" 
                            value={formData.content}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="buttons">
                        <button type="submit">수정</button>
                        <Link to={`/board/view/${id}`}>취소</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BoardEdit;