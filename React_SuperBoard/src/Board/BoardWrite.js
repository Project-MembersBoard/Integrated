import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import './BoardWrite.css';
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Underline from "@tiptap/extension-underline"
// import Link from "@tiptap/extension-link"
import TiptapLink from "@tiptap/extension-link"
import TextStyle from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import TextAlign from "@tiptap/extension-text-align"
import Paragraph from "@tiptap/extension-paragraph"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import CodeBlock from "@tiptap/extension-code-block"
import { Extension } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'

const BoardWrite = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginStatus, setLoginStatus] = useState(false);
    const [userId, setUserId] = useState('');
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        category: '',
        tag: ''
    });
    const [previewImage, setPreviewImage] = useState(null)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const editor = useEditor({
        extensions: [
          StarterKit,
          Bold,
          Italic,
          Underline,
          TiptapLink.configure({ openOnClick: false }),
          TextStyle,
          FontFamily,
          TextAlign.configure({ types: ['heading', 'paragraph'] }),
          Paragraph,
          Heading,
          BulletList,
          OrderedList,
          CodeBlock,
          Placeholder.configure({
            placeholder: '내용을 입력해주세요.',
            // emptyEditorClass: 'is-editor-empty',
            // showOnlyWhenEditable: true,
            // emptyClass: 'is-placeholder',
            // placeholderClass: 'tiptap-placeholder',
        }),
          Extension.create({
            name: 'fontSize',
            addCommands() {
              return {
                setFontSize:
                  (size) =>
                  ({ chain }) => {
                    return chain()
                      .setMark('textStyle', { fontSize: size })
                      .run()
                  },
              }
            },
          }),
        ],
        content: '',
        editorProps: {
        attributes: {
            class: 'tiptap',
            }
        },
        onUpdate: ({ editor }) => {
            setFormData((prev) => ({
                ...prev,
                content: editor.getHTML(),
              }));
        },
      })

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/login/api/member/checkAuth', { withCredentials: true });
                if (!response.data.isLoggedIn) {
                    navigate('/login', { state: { from: location.pathname } });
                } else {
                    setLoginStatus(true);
                    setUserId(response.data.userId);
                    await fetchCategories();
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                navigate('/login', { state: { from: location.pathname } });
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/board/categories', { withCredentials: true });
                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                    // 기본 카테고리 설정 (첫 번째 카테고리)
                    if (response.data.length > 0) {
                        setFormData(prev => ({
                            ...prev,
                            category: response.data[0].name
                        }));
                    }
                } else {
                    console.error("Invalid categories data:", response.data);
                    setError('카테고리 정보를 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setError('카테고리 정보를 불러오는데 실패했습니다.');
            }
        };

        checkAuth();
    }, [navigate, location.pathname]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // 기본 검증
        if (!formData.title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }
        
        if (!formData.content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }
        
        try {
            // 폼 데이터 출력하여 디버깅
            console.log("Submitting form data:", formData);
            
            const response = await axios.post('/api/board/write', formData, { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Server response:", response);
            
            if (response.status === 201) {
                navigate('/board/list');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                
                if (error.response.data && typeof error.response.data === 'string') {
                    alert(error.response.data);
                    setError(error.response.data);
                } else {
                    setError('게시글 작성 중 오류가 발생했습니다.');
                }
            } else if (error.request) {
                setError('서버에서 응답이 없습니다. 네트워크 연결을 확인하세요.');
            } else {
                setError('게시글 작성 요청을 보낼 수 없습니다.');
            }
        }
    };

    if (loading) {
        return <div className="write-container">로딩 중...</div>;
    }

    if (!loginStatus) {
        return <div className="write-container">로그인이 필요합니다.</div>;
    }

    return (
        <div className="write-container">
            <header>
                <h1>게시글 작성</h1>
            </header>
            
            <div className="form-container">
                {error && <div className="error-message">{error}</div>}
                
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
                            required
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
                        {editor && (
                        <>
                        <div className="toolbar" style={{ marginBottom: '10px' }}>
                            <select onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}>
                            <option value="">글꼴</option>
                            <option value="Malgun Gothic">맑은 고딕</option>
                            <option value="Gulim">굴림</option>
                            <option value="Dotum">돋움</option>
                            <option value="Batang">바탕</option>
                            <option value="Gungsuh">궁서</option>
                            </select>
                            <select onChange={(e) => editor.commands.setTextAlign(e.target.value)}>
                            <option value="left">왼쪽 정렬</option>
                            <option value="center">가운데 정렬</option>
                            <option value="right">오른쪽 정렬</option>
                            </select>
                            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
                            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
                            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
                            <button type="button" onClick={() => {
                            const url = prompt("링크를 입력하세요:")
                            if (url) editor.chain().focus().setLink({ href: url }).run()
                            }}>🔗</button>
                        </div>
                        <EditorContent 
                          editor={editor} 
                          className={`tiptap ${editor && editor.isEmpty ? 'is-editor-empty' : ''}`} 
                          style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }} 
                        />
                                                </>
                                            )}
                                    </div>

            <div className="form-group">
                <label>이미지:</label>
                <input type="file" onChange={(e) => {
                    const file = e.target.files[0]
                if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        setFormData((prev) => ({ ...prev, image: reader.result }));
                        setPreviewImage(reader.result)
                    }
                    reader.readAsDataURL(file)
                }
                }} 
                />
                {previewImage && (
                    <img src={previewImage} alt="preview" style={{ width: 200, marginTop: 10 }} />
                )}
            </div>
            
            <div className="buttons">
                <button type="submit">등록</button>
                <RouterLink to="/board/list" className="cancel-btn">취소</RouterLink>
                </div>
                </form>
            </div>
        </div>
    );
};

export default BoardWrite;