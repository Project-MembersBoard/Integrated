"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../App.css"

function AddPost() {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (user) {
      setIsLoggedIn(true)
      setCurrentUser(user)
    } else {
      navigate("/LogIn")
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewPost({
      ...newPost,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPost((prev) => ({
          ...prev,
          image: reader.result,
        }))
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const submitPost = (e) => {
    e.preventDefault()

    if (!newPost.title) {
      alert("제목을 입력해주세요.")
      return
    }

    const newPostData = {
      id: Date.now(),
      userId: currentUser.id,
      title: newPost.title,
      authorName: currentUser.name,
      content: newPost.content,
      image: newPost.image,
      date: new Date().toISOString().split("T")[0],
      views: 0,
    }

    const storedPosts = JSON.parse(localStorage.getItem("boardPosts") || "[]")
    const updatedPosts = [newPostData, ...storedPosts]
    localStorage.setItem("boardPosts", JSON.stringify(updatedPosts))

    setNewPost({ title: "", content: "", image: null })
    setPreviewImage(null)

    alert("게시물이 등록되었습니다.")
    navigate("/Board")
  }

  return (
    <div className="post-form">
      <h3>새 게시물 작성</h3>
      <form onSubmit={submitPost}>
        <div className="form-group">
          <label>제목:</label>
          <input
            type="text"
            name="title"
            value={newPost.title}
            onChange={handleChange}
            placeholder="게시물 제목을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label>내용:</label>
          <textarea
            name="content"
            value={newPost.content}
            onChange={handleChange}
            placeholder="게시물 내용을 입력하세요"
            rows="5"
          />
        </div>
        <div className="form-group">
          <label>이미지 업로드:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {previewImage && (
          <div className="image-preview">
            <p>이미지 미리보기:</p>
            <img
              src={previewImage}
              alt="미리보기"
              style={{ width: "200px", marginTop: "10px", borderRadius: "10px" }}
            />
          </div>
        )}
        <button type="submit">게시물 등록</button>
      </form>
    </div>
  )
}

export default AddPost
