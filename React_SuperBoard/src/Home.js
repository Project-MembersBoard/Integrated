import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const URL = process.env.REACT_APP_API_URL;

const Home = () => {
    const [noticePosts, setNoticePosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [categoryPosts, setCategoryPosts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // 공지사항 (notice 카테고리, 최신 5개)
                const noticeRes = await axios.get(`${URL}/api/board/list?category=공지사항&limit=5`);
                setNoticePosts(noticeRes.data);

                // 인기글 (좋아요 순, 최신 5개)
                const popularRes = await axios.get(`${URL}/api/board/list?order=liked&limit=5`);
                setPopularPosts(popularRes.data);

                // 최신글 (전체, 최신 5개)
                const latestRes = await axios.get(`${URL}/api/board/list?limit=5`);
                setLatestPosts(latestRes.data);

                // 각 카테고리별 최신글 (3개씩)
                const categories = ['일상', '요리', '여행', 'IT', '영화', '운동', '독서', '취업'];
                const categoryData = {};
                
                for (const category of categories) {
                    const res = await axios.get(`${URL}/api/board/list?category=${category}&limit=3`);
                    categoryData[category] = res.data;
                }
                
                setCategoryPosts(categoryData);
                
            } catch (err) {
                console.error("Error fetching home data:", err);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (loading) {
        return <div className="home-container">로딩 중...</div>;
    }

    if (error) {
        return <div className="home-container">{error}</div>;
    }

    return (
        <div className="home-container">
            {/* 배너 섹션 */}
            <div className="banner">
                <h1>SUPER BOARD 에 오신 것을 환영합니다</h1>
                <p>다양한 주제로 소통해보세요</p>
            </div>

            {/* 메인 콘텐츠 섹션 */}
            <div className="main-content">
                {/* 공지사항 & 인기글 */}
                <div className="top-section">
                    <div className="notice-section">
                        <div className="section-header">
                            <h2>공지사항</h2>
                            <Link to="/board/list?category=공지사항" className="more-link">더보기 &gt;&gt;</Link>
                        </div>
                        <ul className="post-list">
                            {noticePosts.length > 0 ? (
                                noticePosts.map(post => (
                                    <li key={post.id} className="post-item">
                                        <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                        <span className="post-date">{formatDate(post.created)}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="no-post">공지사항이 없습니다.</li>
                            )}
                        </ul>
                    </div>

                    <div className="popular-section">
                        <div className="section-header">
                            <h2>인기글</h2>
                            <Link to="/board/list?order=liked" className="more-link">더보기 &gt;&gt;</Link>
                        </div>
                        <ul className="post-list">
                            {popularPosts.length > 0 ? (
                                popularPosts.map(post => (
                                    <li key={post.id} className="post-item">
                                        <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                        <span className="post-likes">❤️ {post.liked}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="no-post">인기글이 없습니다.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* 최신글 */}
                <div className="latest-section">
                    <div className="section-header">
                        <h2>최신 글</h2>
                        <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </div>
                    <ul className="post-list">
                        {latestPosts.length > 0 ? (
                            latestPosts.map(post => (
                                <li key={post.id} className="post-item">
                                    <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                    <span className="post-category">{post.category || '일반'}</span>
                                    <span className="post-date">{formatDate(post.created)}</span>
                                </li>
                            ))
                        ) : (
                            <li className="no-post">최신 글이 없습니다.</li>
                        )}
                    </ul>
                </div>

                {/* 카테고리별 게시판 */}
                                <div className="category-grid">
                                    <div className="category-column">
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>일상</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['일상'] && categoryPosts['일상'].length > 0 ? (
                                                    categoryPosts['일상'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>여행</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['여행'] && categoryPosts['여행'].length > 0 ? (
                                                    categoryPosts['여행'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>영화</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['영화'] && categoryPosts['영화'].length > 0 ? (
                                                    categoryPosts['영화'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>독서</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['독서'] && categoryPosts['독서'].length > 0 ? (
                                                    categoryPosts['독서'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                
                                    <div className="category-column">
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>요리</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['요리'] && categoryPosts['요리'].length > 0 ? (
                                                    categoryPosts['요리'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>IT</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['IT'] && categoryPosts['IT'].length > 0 ? (
                                                    categoryPosts['IT'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>운동</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['운동'] && categoryPosts['운동'].length > 0 ? (
                                                    categoryPosts['운동'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                
                                        <div className="category-section">
                                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>취업</span>
                      <Link to="/board/list" className="more-link">더보기 &gt;&gt;</Link>
                    </h3>
                                            <ul className="post-list">
                                                {categoryPosts['취업'] && categoryPosts['취업'].length > 0 ? (
                                                    categoryPosts['취업'].map(post => (
                                                        <li key={post.id} className="post-item">
                                                            <Link to={`/board/view/${post.id}`} className="post-title">{post.title}</Link>
                                                            <span className="post-date">{formatDate(post.created)}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="no-post">게시글이 없습니다.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                };

export default Home;