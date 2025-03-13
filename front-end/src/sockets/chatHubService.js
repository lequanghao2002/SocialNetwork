import { realtimeHubService } from './realtimeHubService';

const chatHubService = {
    sendMessage: (message) => realtimeHubService.connection.invoke('SendMessage', message),
    updateMessage: (message) => realtimeHubService.connection.invoke('UpdateMessage', message),
    deleteMessage: (messageId) => realtimeHubService.connection.invoke('DeleteMessage', messageId),
    onReceiveMessage: (callback) => realtimeHubService.connection.on('ReceiveMessage', callback),
    offReceiveMessage: () => realtimeHubService.connection.off('ReceiveMessage'),
    onUpdatedMessage: (callback) => realtimeHubService.connection.on('UpdatedMessage', callback),
    offUpdatedMessage: () => realtimeHubService.connection.off('UpdatedMessage'),
};

export default chatHubService;
