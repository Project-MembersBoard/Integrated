// Board.js
"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../App.css"

function Board() {
  const [posts, setPosts] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("latest")
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5
  const [currentUser, setCurrentUser] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentContent, setEditingCommentContent] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState("")

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("boardPosts") || "[]")
    if (storedPosts.length > 0) {
      setPosts(storedPosts)
    } else {
      fetch("/board.json")
        .then((response) => response.json())
        .then((data) => {
          setPosts(data)
          localStorage.setItem("boardPosts", JSON.stringify(data))
        })
        .catch((error) => console.error("Error loading posts:", error))
    }

    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (user) {
      setIsLoggedIn(true)
      setCurrentUser(user)
    }
  }, [])

  const handleAddPost = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.")
      navigate("/LogIn", { state: { from: location } })
      return
    }
    navigate("/AddPost")
  }

  const viewPostDetails = (post) => {
    const updatedPosts = posts.map((p) =>
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    )
    setPosts(updatedPosts)
    localStorage.setItem("boardPosts", JSON.stringify(updatedPosts))
    setSelectedPost({ ...post, views: post.views + 1 })
  }

  const closePostDetails = () => {
    setSelectedPost(null)
    setNewComment("")
    setEditingCommentId(null)
    setEditingCommentContent("")
    setReplyingTo(null)
    setReplyContent("")
  }

  const handleDelete = (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem("boardPosts", JSON.stringify(updatedPosts));
    setSelectedPost(null);
  }

  const handleEdit = (post) => {
    navigate("/AddPost", { state: { postToEdit: post } });
  }

  const addComment = () => {
    if (!newComment.trim()) return;
    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        const newCommentObj = {
          id: Date.now(),
          userId: currentUser.id,
          authorName: currentUser.name,
          content: newComment,
          replies: []
        };
        return {
          ...post,
          comments: post.comments ? [...post.comments, newCommentObj] : [newCommentObj]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("boardPosts", JSON.stringify(updatedPosts));
    setSelectedPost(updatedPosts.find(p => p.id === selectedPost.id));
    setNewComment("");
  };

  const addReply = (commentId) => {
    if (!replyContent.trim()) return;
    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const newReply = {
              id: Date.now(),
              userId: currentUser.id,
              authorName: currentUser.name,
              content: replyContent
            };
            return {
              ...comment,
              replies: comment.replies ? [...comment.replies, newReply] : [newReply]
            };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("boardPosts", JSON.stringify(updatedPosts));
    setSelectedPost(updatedPosts.find(p => p.id === selectedPost.id));
    setReplyingTo(null);
    setReplyContent("");
  };

  const editComment = (commentId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        const updatedComments = post.comments.map(comment =>
          comment.id === commentId ? { ...comment, content: editingCommentContent } : comment
        );
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("boardPosts", JSON.stringify(updatedPosts));
    setSelectedPost(updatedPosts.find(p => p.id === selectedPost.id));
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const deleteComment = (commentId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        const updatedComments = post.comments.filter(comment => comment.id !== commentId);
        return { ...post, comments: updatedComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("boardPosts", JSON.stringify(updatedPosts));
    setSelectedPost(updatedPosts.find(p => p.id === selectedPost.id));
  };

  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const authorMatch = post.authorName?.toLowerCase().includes(searchQuery.toLowerCase())
    const contentMatch =
      typeof post.content === "string" &&
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return titleMatch || authorMatch || contentMatch
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.date) - new Date(a.date)
    } else if (sortOption === "views") {
      return b.views - a.views
    }
    return 0
  })

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)

  return (
    <div className="board-container">
      <h2>자유 게시판</h2>
      <div className="board-actions">
        <button onClick={handleAddPost}>새 게시물 작성</button>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginLeft: "10px", padding: "4px" }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="latest">최신순</option>
          <option value="views">조회수순</option>
        </select>
      </div>

      {selectedPost && (
        <div className="post-details-modal">
          <div className="post-details-content">
            <h3>{selectedPost.title}</h3>
            <p>
              작성자: {selectedPost.authorName} | 작성일: {selectedPost.date} | 조회수: {selectedPost.views}
            </p>
            <div className="post-content">
              <p>{selectedPost.content || "이 게시물에는 내용이 없습니다."}</p>
              {selectedPost.image && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={selectedPost.image}
                    alt="게시물 이미지"
                    style={{ maxWidth: "100%", borderRadius: "10px" }}
                  />
                  <br />
                  <a
                    href={selectedPost.image}
                    download={`image_${selectedPost.id}.jpg`}
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      padding: "6px 12px",
                      backgroundColor: "#4c9aff",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px"
                    }}
                  >
                    이미지 다운로드
                  </a>
                </div>
              )}
            </div>

            {/* 댓글 영역 */}
            <div style={{ marginTop: "30px" }}>
              <h4>댓글</h4>
              {selectedPost.comments?.map((comment) => (
                <div key={comment.id} style={{ marginBottom: "10px", paddingLeft: "10px", borderLeft: "2px solid #ddd" }}>
                  <strong>{comment.authorName}</strong>: {
                    editingCommentId === comment.id ? (
                      <>
                        <input
                          value={editingCommentContent}
                          onChange={(e) => setEditingCommentContent(e.target.value)}
                        />
                        <button onClick={() => editComment(comment.id)}>저장</button>
                        <button onClick={() => setEditingCommentId(null)}>취소</button>
                      </>
                    ) : (
                      <>
                        {comment.content}
                        {currentUser && comment.userId === currentUser.id && (
                          <>
                            <button onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditingCommentContent(comment.content);
                            }}>수정</button>
                            <button onClick={() => deleteComment(comment.id)}>삭제</button>
                          </>
                        )}
                        <button onClick={() => setReplyingTo(comment.id)}>답글</button>
                      </>
                    )
                  }
                  {replyingTo === comment.id && (
                    <div style={{ marginTop: "5px", marginLeft: "20px" }}>
                      <input
                        type="text"
                        placeholder="답글을 입력하세요"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        style={{ width: "70%", marginRight: "10px" }}
                      />
                      <button onClick={() => addReply(comment.id)}>등록</button>
                      <button onClick={() => setReplyingTo(null)}>취소</button>
                    </div>
                  )}
                  {comment.replies?.map((reply) => (
                    <div key={reply.id} style={{ marginLeft: "20px", marginTop: "5px" }}>
                      <strong>{reply.authorName}</strong>: {reply.content}
                    </div>
                  ))}
                </div>
              ))}
              {isLoggedIn && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: "70%", marginRight: "10px" }}
                  />
                  <button onClick={addComment}>댓글 작성</button>
                </div>
              )}
            </div>

            {currentUser && selectedPost.userId === currentUser.id && (
              <div style={{ marginTop: "15px" }}>
                <button onClick={() => handleEdit(selectedPost)} style={{ marginRight: "10px" }}>수정</button>
                <button onClick={() => handleDelete(selectedPost.id)}>삭제</button>
              </div>
            )}
            <button onClick={closePostDetails} style={{ marginTop: "15px" }}>닫기</button>
          </div>
        </div>
      )}

      <div className="posts-table">
        <table>
          <thead>
            <tr>
              <th>작성자 ID</th>
              <th>제목</th>
              <th>작성자 이름</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.id} onClick={() => viewPostDetails(post)} className="post-row">
                <td>{post.userId}</td>
                <td>{post.title}</td>
                <td>{post.authorName}</td>
                <td>{post.date}</td>
                <td>{post.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={currentPage === pageNum ? "active-page" : ""}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Board