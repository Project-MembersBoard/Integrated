import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardView.css';

const BoardView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [board, setBoard] = useState({});
    const [loginChecked, setLoginChecked] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [userId, setUserId] = useState(null);
    const [tags, setTags] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // const [selectedPost, setSelectedPost] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [currentUser, setCurrentUser] = useState(null); // 로그인한 사용자 정보
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        console.log('[DEBUG] useEffect triggered for board view');
      
        const checkAuthAndFetchBoard = async () => {
          try {
            const response = await axios.get('/login/api/member/checkAuth', { withCredentials: true });
            console.log('[DEBUG] Auth check result:', response.data);
    
            if (!response.data.isLoggedIn) {
                alert("로그인이 필요합니다");
                navigate('/login', { state: { from: location.pathname } });
                setLoginStatus(false);
                setLoginChecked(true); 
                return;
            }
            
            setLoginStatus(true); 
            setUserId(response.data.userId);
            setCurrentUser({ id: response.data.userId, name: response.data.userName });
            setIsLoggedIn(true);
            
            const boardRes = await axios.get(`/api/board/view/${id}`, { withCredentials: true });
            console.log('[DEBUG] Board fetch result:', boardRes.data);

            setBoard(boardRes.data);
            // setSelectedPost(boardRes.data);
            setLikeCount(boardRes.data.liked);
            if (boardRes.data.tag) {
                setTags(boardRes.data.tag.split(',').map(tag => tag.trim()));
                }
                    
            const likeRes = await axios.get(`/api/board/checkLike/${id}`, { withCredentials: true });
            setLiked(likeRes.data.liked);
            await fetchComments();

        } catch (err) {
            console.error('[DEBUG] Error occurred:', err);
            setError('게시글을 불러오는 중 오류가 발생했습니다.');
            navigate('/login', { state: { from: location.pathname } });
            setLoading(false);
        } finally {
            setLoading(false);
            setLoginChecked(true); // ✅ 여기 반드시 호출
            console.log('[DEBUG] setLoading(false)');
        }
    };

        checkAuthAndFetchBoard();
      }, [id, navigate, location.pathname]);
    
     const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments/board/${id}`, { withCredentials: true });
                setComments(response.data);
                console.log('[DEBUG] Comments:', response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

    const handleLike = async () => {
        if (!loginStatus) {
            alert('좋아요를 누르려면 로그인이 필요합니다.');
            return;
        }
        
        try {
            const response = await axios.post(`/api/board/like/${id}`, {}, { withCredentials: true });
            
            // API에서 받은 새로운 좋아요 상태와 총 좋아요 수 업데이트
            setLiked(response.data.liked);
            setLikeCount(response.data.totalLikes);
            
            // 게시글 객체의 좋아요 카운트도 업데이트
            // setBoard(prevBoard => ({
                //     ...prevBoard,
                //     liked: response.data.totalLikes
                // }));
                console.log("좋아요 업데이트:", response.data);
            } catch (error) {
                console.error("Error handling like:", error);
                alert('좋아요 처리 중 오류가 발생했습니다.');
            }
    };
    
    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/api/board/delete/${id}`, { withCredentials: true });
                navigate('/board/list');
            } catch (error) {
                console.error("Error deleting board:", error);
                if (error.response && error.response.status === 403) {
                    alert('자신이 작성한 글만 삭제할 수 있습니다.');
                } else {
                    alert('삭제 중 오류가 발생했습니다.');
                }
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // const addComment = () => {
    //     if (!newComment.trim()) return;
    //     const updatedComments = [...(board.comments || []), {
    //     id: Date.now(),
    //     userId,
    //     authorName: currentUser.name,
    //     content: newComment,
    //     replies: []
    //     }];
    //     setBoard(prev => ({ ...prev, comments: updatedComments }));
    //     setNewComment('');
    // };

    const addComment = async () => {
            if (!newComment.trim()) return;
            
            try {
                const commentData = {
                    content: newComment,
                    boardId: parseInt(id)
                };
                
                await axios.post(`/api/comments/board/${id}`, commentData, { withCredentials: true });
                
                await fetchComments();
                setNewComment('');
            } catch (error) {
                console.error("Error adding comment:", error);
                if (error.response && error.response.status === 401) {
                    alert('로그인이 필요합니다.');
                    navigate('/login');
                } else {
                    alert('댓글 작성 중 오류가 발생했습니다.');
                }
            }
        };

    
    //   const addReply = (commentId) => {
    //     if (!replyContent.trim()) return;
    //     const updatedComments = board.comments.map(comment => {
    //       if (comment.id === commentId) {
    //         const newReply = {
    //           id: Date.now(),
    //           userId,
    //           authorName: currentUser.name,
    //           content: replyContent
    //         };
    //         return {
    //           ...comment,
    //           replies: [...(comment.replies || []), newReply]
    //         };
    //       }
    //       return comment;
    //     });
    //     setBoard(prev => ({ ...prev, comments: updatedComments }));
    //     setReplyingTo(null);
    //     setReplyContent('');
    //   };

    const addReply = async (commentId) => {
            if (!replyContent.trim()) return;
            
            try {
                const replyData = {
                    content: replyContent,
                    boardId: parseInt(id)
                };
                
                await axios.post(`/api/comments/${commentId}/reply`, replyData, { withCredentials: true });
                
                await fetchComments();
                setReplyingTo(null);
                setReplyContent('');
            } catch (error) {
                console.error("Error adding reply:", error);
                if (error.response && error.response.status === 401) {
                    alert('로그인이 필요합니다.');
                    navigate('/login');
                } else {
    
                    alert('답글 작성 중 오류가 발생했습니다.');
                    
                }
            }
        };
    
    // const handleEditComment = (commentId) => {
    //     const updatedComments = board.comments.map(comment =>
    //       comment.id === commentId ? { ...comment, content: editingCommentContent } : comment
    //     );
    //     setBoard(prev => ({ ...prev, comments: updatedComments }));
    //     setEditingCommentId(null);
    //     setEditingCommentContent('');
    //   };
    
    //   const handleDeleteComment = (commentId) => {
    //     const updatedComments = board.comments.filter(comment => comment.id !== commentId);
    //     setBoard(prev => ({ ...prev, comments: updatedComments }));
    //   };

    const handleEditComment = async (commentId) => {
            try {
                const commentData = {
                    content: editingCommentContent
                };
                
                await axios.put(`/api/comments/${commentId}`, commentData, { withCredentials: true });
                
                await fetchComments();
                setEditingCommentId(null);
                setEditingCommentContent('');
            } catch (error) {
                console.error("Error updating comment:", error);
                if (error.response && error.response.status === 403) {
                    alert('자신이 작성한 댓글만 수정할 수 있습니다.');
                } else {
                    alert('댓글 수정 중 오류가 발생했습니다.');
                }
            }
        };
        
        // 댓글 삭제 함수
        const handleDeleteComment = async (commentId) => {
            if (!window.confirm('정말 삭제하시겠습니까?')) return;
            
            try {
                await axios.delete(`/api/comments/${commentId}`, { withCredentials: true });
                
                await fetchComments();
            } catch (error) {
                console.error("Error deleting comment:", error);
                if (error.response && error.response.status === 403) {
                    alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
                } else {
                    alert('댓글 삭제 중 오류가 발생했습니다.');
                }
            }
        };

        
    if (loading) {return <div className="view-container">로딩 중...</div>;}
    if (error) return <div className="view-container error-message">{error}</div>;
    if (!loginStatus) return <div>로그인이 필요합니다.</div>;


    const imageURL = board.image && typeof board.image === 'string' && board.image.startsWith('data:image')
  ? board.image // base64 이미지
  : board.image;

  console.log(imageURL);
  console.log(board);
   
  return (
          <div className="view-container">
              <>
                  <header>
                      <h1>게시글 상세보기</h1>
                  </header>
  
                  <div className="board-content-container">
                      <div className="board-header">
                          <div className="board-title">{board.title}</div>
                          <div className="board-info">
                              <span>작성자: {board.writer}</span>
                              <span>카테고리: {board.category || '없음'}</span>
                              <span>작성일: {formatDate(board.created)}</span>
                              <span>조회수: {board.hit}</span>
                          </div>
                      </div>
  
                      <div className="board-content">
                      <div className="board-text" dangerouslySetInnerHTML={{ __html: board.content }} ></div>
                          {/* {board.content} */}
  
                          {board.image && (
                              <div style={{ marginTop: "10px" }}>
                                  <img src={board.image} alt="게시물 이미지" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                                  <br />
                                  {board.image && !board.image.startsWith('data:image') && (
                                      <a
                                          href={imageURL}
                                          download={`image_${board.id}.jpg`}
                                          style={{ display: 'inline-block', marginTop: '8px', padding: '6px 12px', backgroundColor: '#4c9aff', color: 'white', textDecoration: 'none', borderRadius: '6px' }}
                                      >
                                          이미지 다운로드
                                      </a>
                                  )}
                              </div>
                          )}
  
                          {tags.length > 0 && (
                              <div className="board-tags">
                                  {tags.map((tag, index) => (
                                      <span key={index} className="tag">#{tag}</span>
                                  ))}
                              </div>
                          )}
  
                          <div className="like-container">
                              <button 
                                  className={`like-button ${liked ? 'liked' : ''}`} 
                                  onClick={handleLike}
                              >
                                  {liked ? '❤️' : '🤍'} 좋아요 {likeCount}
                              </button>
                          </div>
  
                          <div style={{ marginTop: "30px" }}>
                              <h4>댓글</h4>
                              {comments.map((comment) => (
                                  <div key={comment.id} style={{ 
                                      marginBottom: "10px", 
                                      paddingLeft: comment.parentId ? "30px" : "10px",
                                      borderLeft: comment.parentId ? "2px solid #ccc" : "2px solid #ddd"
                                  }}>
                                      <strong>{comment.userName || comment.userId}</strong>: 
                                      {editingCommentId === comment.id ? (
                                          <>
                                              <input 
                                                  value={editingCommentContent} 
                                                  onChange={(e) => setEditingCommentContent(e.target.value)}
                                                  style={{ marginLeft: "10px", padding: "5px" }}
                                              />
                                              <button 
                                                  onClick={() => handleEditComment(comment.id)}
                                                  style={{ marginLeft: "5px", padding: "5px 10px" }}
                                              >
                                                  저장
                                              </button>
                                              <button 
                                                  onClick={() => setEditingCommentId(null)}
                                                  style={{ marginLeft: "5px", padding: "5px 10px" }}
                                              >
                                                  취소
                                              </button>
                                          </>
                                      ) : (
                                          <>
                                              {` ${comment.content}`}
                                              {currentUser?.id === comment.userId && (
                                                  <>
                                                      <button 
                                                          onClick={() => {
                                                              setEditingCommentId(comment.id);
                                                              setEditingCommentContent(comment.content);
                                                          }}
                                                          style={{ marginLeft: "10px", padding: "5px 10px" }}
                                                      >
                                                          수정
                                                      </button>
                                                      <button 
                                                          onClick={() => handleDeleteComment(comment.id)}
                                                          style={{ marginLeft: "5px", padding: "5px 10px" }}
                                                      >
                                                          삭제
                                                      </button>
                                                  </>
                                              )}
                                              {!comment.parentId && (
                                                  <button 
                                                      onClick={() => setReplyingTo(comment.id)}
                                                      style={{ marginLeft: "10px", padding: "5px 10px" }}
                                                  >
                                                      답글
                                                  </button>
                                              )}
                                          </>
                                      )}
                                      
                                      {replyingTo === comment.id && (
                                          <div style={{ marginTop: "10px", 
                                              marginLeft: "20px",
                                              display: "flex",
                                              flexDirection: "column" }}>
                                              <div style={{ display: "flex", marginBottom: "5px" }}>
              <input 
                  type="text" 
                  placeholder="답글을 입력하세요" 
                  value={replyContent} 
                  onChange={(e) => setReplyContent(e.target.value)} 
                  style={{ 
                      width: "70%", 
                      padding: "5px", 
                      marginRight: "10px" 
                  }}
              />
              <div>
                  <button 
                      onClick={() => addReply(comment.id)}
                      style={{ 
                          padding: "5px 10px",
                          marginRight: "5px"
                      }}
                  >
                      등록
                  </button>
                  <button 
                      onClick={() => setReplyingTo(null)}
                      style={{ padding: "5px 10px" }}
                  >
                      취소
                  </button>
              </div>
          </div>
      </div>
  )}
                                      
                                      {comment.replies && comment.replies.map((reply) => (
                                          <div key={reply.id} style={{ 
                                              marginLeft: "20px", 
                                              marginTop: "10px",
                                              paddingLeft: "15px",
                                              borderLeft: "2px solid #eee"
                                          }}>
                                              <strong>{reply.userName || reply.userId}</strong>
                                              {editingCommentId === reply.id ? (
                                                  <>
                                                      <input 
                              value={editingCommentContent} 
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                              style={{ marginLeft: "10px", padding: "5px" }}
                          />
                          <button 
                              onClick={() => handleEditComment(reply.id)}
                              style={{ marginLeft: "5px", padding: "5px 10px" }}
                          >
                              저장
                          </button>
                          <button 
                              onClick={() => setEditingCommentId(null)}
                              style={{ marginLeft: "5px", padding: "5px 10px" }}
                          >
                              취소
                          </button>
                      </>
                  ) : (
                      <>
                          {reply.content && `: ${reply.content}`}
                          {currentUser?.id === reply.userId && (
                              <>
                                  <button 
                                      onClick={() => {
                                          setEditingCommentId(reply.id);
                                          setEditingCommentContent(reply.content);
                                      }}
                                      style={{ marginLeft: "10px", padding: "5px 10px" }}
                                  >
                                      수정
                                  </button>
                                  <button 
                                      onClick={() => handleDeleteComment(reply.id)}
                                      style={{ marginLeft: "5px", padding: "5px 10px" }}
                                  >
                                      삭제
                                  </button>
                              </>
                          )}
                      </>
                  )}
              </div>
          ))}
      </div>
  ))}
                              
                              {isLoggedIn && (
                                  <div style={{ marginTop: "20px" }}>
                                      <input 
                                          type="text" 
                                          placeholder="댓글을 입력하세요" 
                                          value={newComment} 
                                          onChange={(e) => setNewComment(e.target.value)} 
                                          style={{ width: "70%", padding: "8px", marginRight: "10px" }} 
                                      />
                                      <button 
                                          onClick={addComment}
                                          style={{ padding: "8px 15px", backgroundColor: "#4c9aff", color: "white", border: "none", borderRadius: "4px" }}
                                      >
                                          댓글 작성
                                      </button>
                                  </div>
                              )}
                          </div>
  
                          <div className="buttons">
                              <Link to="/board/list" className="btn-list">목록</Link>
                              {loginStatus && (userId.trim() === board.writer.trim() || userId.trim() === 'admin') && (
                                  <>
                                      <Link to={`/board/edit/${board.id}`} className="btn-edit">수정</Link>
                                      <button className="btn-delete" onClick={handleDelete}>삭제</button>
                                  </>
                              )}
                          </div>
                      </div>
                  </div>
              </>
          </div>
      );
  };
  
  export default BoardView;