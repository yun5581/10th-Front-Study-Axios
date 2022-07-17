/* eslint-disable */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
	// 받아온 데이터 저장하는 state
	const [posts, setPosts] = useState([]);
	const [singlePost, setSinglePost] = useState({});
	const [comments, setComments] = useState([]);

	// input에 입력된 게시글과 댓글
	const [newPost, setNewPost] = useState('');
	const [newComment, setNewComment] = useState('');

	// 상세 조회하고자 하는 게시글의 id
	const id = 28;

	// 새로고침 될 때 마다 실행됩니다.
	useEffect(() => {
		getPosts();
		getSinglePost();
	}, []);

	// 전체 게시글 조회 함수
	const getPosts = async () => {
		const response = await axios
			.get('https://dy6578.pythonanywhere.com/api/posts/')
			.then(response => {
				setPosts(response.data); // (전체 게시글 저장)
			})
			.catch(error => {
				console.log('전체 글 불러오기 실패', error.message);
			});
	};

	// 특정 게시글 조회
	const getSinglePost = async () => {
		const response = await axios
			.get(`https://dy6578.pythonanywhere.com/api/posts/${id}`) //백틱은 연산자 들어갈때
			.then(response => {
				setSinglePost(response.data); // ?? (특정 게시글 저장)
				setComments(response.data.comment); // ?? (댓글 저장)
			})
			.catch(error => {
				console.log('글 하나 불러오기 실패');
			});
	};

	// 새로운 게시글 작성 함수
	const PostSubmit = e => {
		e.preventDefault();

		// 아래 코드 중 .post("??", {})에서 { }도 채워주세요 !!
		axios
			.post('https://dy6578.pythonanywhere.com/api/posts/', {
				title: '제목',
				author: 1,
				content: newPost,
			})
			.then(response => {
				getPosts(); // ?? (게시글 불러오기)
			})
			.catch(error => {
				console.log('작성 실패');
			});
		setNewPost(''); // ???? (input 비우기)
	};

	// 새로운 댓글 작성 함수
	const CommentSubmit = e => {
		e.preventDefault();

		// 아래 코드 중 .post("????", { })에서 { }도 채워주세요 !!
		axios
			.post('https://dy6578.pythonanywhere.com/api/commenets/', {
				post: id,
				author: 1,
				content: newComment,
			})
			.then(response => {
				getPosts(); // ?? (게시글 불러오기)
				getSinglePost(); // ?? (특정 게시글 불러오기)
			})
			.catch(function (error) {
				console.log('댓글 작성 실패', error);
			});
		setNewComment(''); // ??? (input 비우기)
	};

	// 게시글 삭제 함수
	const onDelete = id => {
		axios
			.delete(`https://dy6578.pythonanywhere.com/api/posts/${id}`)
			.then(response => {
				getPosts(response.data); // ???? (전체 게시글 불러오기)
			})
			.catch(error => {
				console.log('삭제 실패', error);
			});
	};

	return (
		<div>
			<form onSubmit={PostSubmit}>
				<input
					placeholder="새 게시글 작성하기 "
					value={newPost}
					onChange={e => setNewPost(e.target.value)}
				/>
				<button>작성</button>
			</form>

			{posts.map(post => {
				return (
					<p style={{ border: '1px solid red' }}>
						{post.content}
						<button onClick={() => onDelete(post.id)}>삭제</button>
					</p>
				);
			})}

			<div style={{ border: '1px solid blue' }}>
				<h1>{singlePost.content}</h1>
				{comments.map(comment => {
					return <p>ㄴ {comment.content}</p>;
				})}

				<form onSubmit={CommentSubmit}>
					<input
						placeholder="댓글 작성하기"
						value={newComment}
						onChange={e => setNewComment(e.target.value)}
					/>
					<button>작성</button>
				</form>
			</div>
		</div>
	);
}

export default App;
