import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './BoardList.css';

const URL = process.env.REACT_APP_API_URL;

const BoardList = () => {
    const [boards, setBoards] = useState([]);
    const [loginStatus, setLoginStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체게시판');

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('latest');
    
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    // const [totalPages, setTotalPages] = useState(1);

    const [commentCounts, setCommentCounts] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    const checkStatus = async () => {
        try {
            const response = await fetch(`${URL}/etc/checkUserStatus`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (response.ok) {
                const result = await response.text();
                if (result === '정지') {
                    alert('해당 계정은 열람하실 수 없습니다.');
                    navigate('/');
                }
            } else {
                alert('정지 확인 실패');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authRes = await axios.get(`${URL}/login/api/member/checkAuth`, {
                    withCredentials: true,
                });
                setLoginStatus(authRes.data.isLoggedIn || false);
            } catch {
                setLoginStatus(false);
            }

            try {
                const boardsRes = await axios.get(`${URL}/api/board/list`, {
                    withCredentials: true,
                });
                setBoards(boardsRes.data);
                // setTotalPages(Math.ceil(boardsRes.data.length / postsPerPage));

                const counts = {};
                    for (const board of boardsRes.data) {
                        try {
                            const commentRes = await axios.get(`${URL}/api/comments/board/${board.id}/count`, {
                            withCredentials: true,
                            });
                            counts[board.id] = commentRes.data.totalCount || 0;
                        } catch (err) {
                            console.error(`댓글 수 조회 실패 (게시글 ${board.id}):`, err);
                            counts[board.id] = 0;
                        }
                    }
                setCommentCounts(counts);

                const categoriesRes = await axios.get(`${URL}/api/board/categories`, {
                    withCredentials: true,
                });
                setCategories(categoriesRes.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate('/login', { state: { from: location.pathname } });
                } else {
                    setError('게시글을 불러오는 중 오류가 발생했습니다.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        checkStatus();
    }, [navigate, location.pathname, postsPerPage]);

    
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };
    
    const filteredPosts = boards.filter((post) => {
        const lower = searchQuery.toLowerCase();
        const title = post.title?.toLowerCase().includes(lower);
        const writer = post.writer?.toLowerCase().includes(lower);
        const content = typeof post.content === 'string' && post.content.toLowerCase().includes(lower);
        const tagMatch = post.tags?.some((tag) => `#${tag.toLowerCase()}`.includes(lower));
        const categoryMatch = selectedCategory === '전체게시판' || post.category === selectedCategory;
        
        return (title || writer || content || tagMatch) && categoryMatch;
    });
    
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortOption === 'latest') {
            return new Date(b.created) - new Date(a.created);
        } else if (sortOption === 'views') {
            return b.hit - a.hit;
        }
        return 0;
    });
    
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
    
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    }, [totalPages]);

    // }, [sortedPosts, postsPerPage]);
    
    const currentPosts = sortedPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const renderPagination = () => {
        const pageNumbers = [];
        const max = 5;
        let start = Math.max(1, currentPage - Math.floor(max / 2));
        let end = Math.min(totalPages, start + max - 1);
        if (end - start < max - 1) start = Math.max(1, end - max + 1);

        for (let i = start; i <= end; i++) pageNumbers.push(i);

        return (
            <div className="pagination">
                <button onClick={() => setCurrentPage(1)}>&laquo;</button>
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>&lt;</button>
                {pageNumbers.map((n) => (
                    <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        className={currentPage === n ? 'active' : ''}
                    >
                        {n}
                    </button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>&gt;</button>
                <button onClick={() => setCurrentPage(totalPages)}>&raquo;</button>
            </div>
        );
    };

    if (loading) return <div className="board-container">로딩 중...</div>;

    return (
        <div className="board-container">
            <header>
                <h1>게시글 목록</h1>
            </header>

            <div className="category-tabs">
                <button
                    className={selectedCategory === '전체게시판' ? 'active' : ''}
                    onClick={() => handleCategoryClick('전체게시판')}
                >
                    전체게시판
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={selectedCategory === cat.name ? 'active' : ''}
                        onClick={() => handleCategoryClick(cat.name)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <input
                type="text"
                placeholder="검색어 입력"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '180px', marginLeft: '85%', padding: '4px', marginBottom: '4px' }}
            />

            <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ marginLeft: '1122px' , border:'1px solid #8d560454', color:'#8d5604', marginBottom: '10px'}}
            >
                <option value="latest">최신순</option>
                <option value="views">조회수순</option>
            </select>

            {loginStatus && (
                <div className="write-button-container">
                    <Link to="/board/write" className="btn-write">
                        글쓰기
                    </Link>
                </div>
            )}

            {currentPosts.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th width="7%">번호</th>
                            <th width="45%">제목</th>
                            <th width="10%">카테고리</th>
                            <th width="13%">작성자</th>
                            <th width="7%">조회수</th>
                            <th width="7%">좋아요</th>
                            <th width="11%">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((board) => (
                            <tr key={board.id}>
                                <td>{board.id}</td>
                                <td>
                                    <Link to={`/board/view/${board.id}`} className="title-link">
                                        {board.title}
                                        {commentCounts[board.id] > 0 && (
                                            <span className="comment-count"> [{commentCounts[board.id]}]</span>
                                        )}
                                    </Link>
                                </td>
                                <td>{board.category || '-'}</td>
                                <td>{board.writer}</td>
                                <td>{board.hit}</td>
                                <td>{board.liked}</td>
                                <td>{new Date(board.created).toISOString().split('T')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="no-posts">게시글이 없습니다.</div>
            )}

            {sortedPosts.length > 0 && renderPagination()}
        </div>
    );
};

export default BoardList;
