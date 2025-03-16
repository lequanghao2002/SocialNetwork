import { createSlice } from '@reduxjs/toolkit';
import { deletePostThunk, fetchCommentsThunk, fetchPostsThunk, savePostThunk, unSavePostThunk } from './postThunk';

const initialState = {
    posts: [],
    loading: false,
    paging: {
        page: 1,
        pageSize: 10,
    },
    filter: {
        status: 'Recent',
    },
    hasMore: true,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        // setPosts: (state, action) => {
        //     state.posts = action.payload;
        // },
        addPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        updatePost: (state, action) => {
            const post = state.posts.find((post) => post.id === action.payload.id);
            if (post) {
                Object.assign(post, action.payload);
            }
        },
        setStatus: (state, action) => {
            state.filter.status = action.payload;

            // Reset lại nếu thay đổi status
            state.paging = {
                page: 1,
                pageSize: 10,
            };
            state.hasMore = true;
            state.posts = [];
        },
        setLike: (state, action) => {
            const { id, userId, type } = action.payload;
            const post = state.posts.find((post) => post.id === id);

            if (post) {
                if (type === 'add' && !post.likes.includes(userId)) {
                    post.likes.push({ userId });
                } else if (type === 'delete') {
                    post.likes = post.likes.filter((like) => like.userId !== userId);
                }
            }
        },
        addComment: (state, action) => {
            const comment = action.payload;
            const post = state.posts.find((post) => post.id === comment.postId);

            if (!post) return;

            post.comments.unshift(comment);
            post.commentCount += 1;
        },
        updateComment: (state, action) => {
            const comment = action.payload;
            const post = state.posts.find((post) => post.id === comment.postId);
            const commentUpdate = post.comments.find((c) => c.id === comment.id);

            if (!commentUpdate) return;

            Object.assign(commentUpdate, comment);
        },
        deleteComment: (state, action) => {
            const { postId, commentId } = action.payload;
            const post = state.posts.find((post) => post.id === postId);

            if (!post) return;

            const initialCount = post.comments.length;

            // -------------------- Dùng BFS (Queue) -------------------- //
            // const deleteSet = new Set();
            // const queue = [commentId];
            // while (queue.length > 0) {
            //     const currentId = queue.shift();
            //     deleteSet.add(currentId);

            //     post.comments.forEach((comment) => {
            //         if (comment.parentId === currentId) queue.push(comment.id);
            //     });
            // }

            // -------------------- Dùng DFS (Stack) -------------------- //
            // const deleteSet = new Set();
            // const stack = [commentId];
            // while (stack.length > 0) {
            //     const currentId = stack.pop();
            //     deleteSet.add(currentId);

            //     post.comments.forEach((comment) => {
            //         if (comment.parentId === currentId) stack.push(comment.id);
            //     });
            // }

            // -------------------- Dùng Map + Set để tìm con cháu -------------------- //
            // Tạo Map để nhóm comment theo parentId
            const commentMap = new Map();
            post.comments.forEach((comment) => {
                if (!commentMap.has(comment.parentId)) {
                    commentMap.set(comment.parentId, []);
                }
                commentMap.get(comment.parentId).push(comment.id);
            });

            // Tìm tất cả con cháu của commentId (Dùng Set + BFS)
            const deleteSet = new Set();
            const queue = [commentId];

            while (queue.length > 0) {
                const currentId = queue.shift();
                deleteSet.add(currentId);

                if (commentMap.has(currentId)) {
                    queue.push(...commentMap.get(currentId));
                }
            }

            post.comments = post.comments.filter((comment) => !deleteSet.has(comment.id));
            post.commentCount -= initialCount - post.comments.length;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchPostsThunk
            .addCase(fetchPostsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPostsThunk.fulfilled, (state, action) => {
                const { data, page, hasMore } = action.payload;
                if (page === 1) {
                    state.posts = data;
                } else {
                    state.posts = [...state.posts, ...data];
                }

                state.paging.page = page + 1;
                state.hasMore = hasMore;
                state.loading = false;
            })
            .addCase(fetchPostsThunk.rejected, (state) => {
                state.loading = false;
            })

            .addCase(deletePostThunk.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post.id !== action.payload);
            })

            .addCase(savePostThunk.fulfilled, (state, action) => {
                const { postId, userId } = action.payload;

                const post = state.posts.find((post) => post.id === postId);
                post.favourites.push({ userId });
            })

            .addCase(unSavePostThunk.fulfilled, (state, action) => {
                const { postId, userId } = action.payload;

                const post = state.posts.find((post) => post.id === postId);
                post.favourites = post.favourites.filter((favourite) => favourite.userId !== userId);
            })

            .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
                const { postId, comments } = action.payload;

                const post = state.posts.find((post) => post.id === postId);

                if (post) {
                    post.comments = comments;
                }
            });
    },
});

export const { setPosts, setStatus, addPost, updatePost, setLike, addComment, updateComment, deleteComment } =
    postSlice.actions;

export default postSlice;
