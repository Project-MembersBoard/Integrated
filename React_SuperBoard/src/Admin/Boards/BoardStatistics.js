import { useOutletContext } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BoardStatistics.css';

const BoardStatistics = () => {
  const { isAdmin } = useOutletContext();
  const [timeStats, setTimeStats] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    if (!isAdmin) {
      setError('관리자만 접근할 수 있습니다.');
      setLoading(false);
      return;
    }

    const fetchAllStatistics = async () => {
      try {
        const [timeResponse, popularResponse, authorsResponse] = await Promise.all([
          axios.get(`/api/board/statistics/time?period=${period}`, { withCredentials: true }),
          axios.get('/api/board/statistics/popular', { withCredentials: true }),
          axios.get('/api/board/statistics/authors', { withCredentials: true })
        ]);

        setTimeStats(timeResponse.data);
        setPopularPosts(popularResponse.data);
        setTopAuthors(authorsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError('통계를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchAllStatistics();
  }, [period, isAdmin, selectedYear, selectedMonth]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const formatDate = (date, periodType = 'default') => {
    // date가 null 또는 undefined인 경우
    if (!date) return '';
    
    // periodType에 따라 다른 포맷팅 적용
    switch (periodType) {
      case 'year':
        // date가 숫자(년도)인 경우
        if (typeof date === 'number') return `${date}년`;
        // date가 문자열이고 숫자만 포함된 경우
        if (/^\d+$/.test(date)) return `${date}년`;
        return date;
      
      case 'month':
        // date가 year와 month 프로퍼티를 가진 객체인 경우
        if (date.year && date.month) return `${date.year}년 ${date.month}월`;
        // date가 문자열인 경우 (YYYY-MM 형식)
        if (typeof date === 'string' && date.includes('-')) {
          const [year, month] = date.split('-');
          return `${year}년 ${month}월`;
        }
        return date;
      
      case 'week':
        // date가 year, month, week_of_month 프로퍼티를 가진 객체인 경우
        if (date.year && date.month && date.week_of_month) {
          return `${date.year}년 ${date.month}월 ${date.week_of_month}주차`;
        }
        return date;
      
      default:
        // 기본 날짜 문자열 포맷팅 (YYYY-MM-DD)
        if (typeof date === 'string') {
          try {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
              return dateObj.toISOString().split('T')[0];
            }
          } catch (e) {
            console.error('Date parsing error:', e);
          }
        }
        return date;
    }
  };

  const getAvailableYears = () => {
    const years = new Set();
    timeStats.forEach(stat => {
      years.add(stat.year || new Date(stat.date).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const getAvailableMonths = () => {
    const months = new Set();
    timeStats.forEach(stat => {
      if (stat.year === selectedYear || !stat.year) {
        months.add(stat.month || new Date(stat.date).getMonth() + 1);
      }
    });
    return Array.from(months).sort((a, b) => b - a);
  };

  const filteredStats = timeStats.filter(stat => {
    if (period === 'year') return true;
    if (!stat.year) return true; // 이전 버전과 호환을 위해
    if (period === 'month') return stat.year === selectedYear;
    return stat.year === selectedYear && stat.month === selectedMonth;
  });

  if (loading) {
    return <div className="board-statistics-container">로딩 중...</div>;
  }

  if (error) {
    return <div className="board-statistics-container">{error}</div>;
  }

  return (
    <div className="board-statistics-container">
      <header>
        <h1>게시글 통계</h1>
      </header>

      <div className="statistics-content">
        {/* 기간별 게시글 통계 */}
        <div className="time-statistics">
          <div className="section-header">
            <h2>기간별 게시글 통계</h2>
            <select value={period} onChange={handlePeriodChange}>
              <option value="week">주간</option>
              <option value="month">월간</option>
              <option value="year">연간</option>
            </select>
            
            {period !== 'year' && (
              <select value={selectedYear} onChange={handleYearChange}>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
            )}
            
            {period === 'week' && (
              <select value={selectedMonth} onChange={handleMonthChange}>
                {getAvailableMonths().map(month => (
                  <option key={month} value={month}>{month}월</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="chart-container">
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : filteredStats.length > 0 ? (
              <table className="statistics-table">
                <thead>
                  <tr>
                    <th>{period === 'year' ? '연도' : period === 'month' ? '년월' : '주차'}</th>
                    <th>게시글 수</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStats.map((stat, index) => (
                    <tr key={index}>
                      <td>
                        {period === 'year' 
                          ? `${stat.year}년` 
                          : period === 'month' 
                            ? `${stat.year}년 ${stat.month}월` 
                            : `${stat.year}년 ${stat.month}월 ${stat.week_of_month}주차`}
                      </td>
                      <td>{stat.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>데이터가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 인기 게시글 */}
        <div className="popularity-statistics">
          <h2>인기 게시글</h2>
          {popularPosts.length > 0 ? (
            <table className="statistics-table">
              <thead>
                <tr>
                  <th>제목</th><th>작성자</th><th>조회수</th><th>좋아요</th><th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {popularPosts.map(post => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.writer}</td>
                    <td>{post.hit}</td>
                    <td>{post.liked}</td>
                    <td>{formatDate(post.created)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>데이터가 없습니다.</p>
          )}
        </div>

        {/* 활발한 작성자 */}
        <div className="author-statistics">
          <h2>활발한 작성자</h2>
          {topAuthors.length > 0 ? (
            <table className="statistics-table">
              <thead>
                <tr><th>순위</th><th>아이디</th><th>게시글 수</th><th>총 조회수</th><th>총 좋아요</th></tr>
              </thead>
              <tbody>
                {topAuthors.map((author, index) => (
                  <tr key={author.userid}>
                    <td>{index + 1}</td>
                    <td>{author.userid}</td>
                    <td>{author.postCount}</td>
                    <td>{author.totalHits}</td>
                    <td>{author.totalLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardStatistics;