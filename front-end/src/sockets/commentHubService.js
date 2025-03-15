import { realtimeHubService } from './realtimeHubService';

const commentHubService = {
    joinPostGroup: (postId) => realtimeHubService.connection.invoke('JoinPostGroup', postId),
    leavePostGroup: (postId) => realtimeHubService.connection.invoke('LeavePostGroup', postId),
    addComment: async (data) => await realtimeHubService.connection.invoke('AddComment', data),
    updateComment: async (data) => await realtimeHubService.connection.invoke('UpdateComment', data),
    deleteComment: async (commentId) => await realtimeHubService.connection.invoke('DeleteComment', commentId),
    onCommentChanged: (callback) => realtimeHubService.connection.on('CommentChanged', callback),
    offCommentChanged: () => realtimeHubService.connection.off('CommentChanged'),
};

export default commentHubService;
