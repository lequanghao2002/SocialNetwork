import { realtimeHubService } from './realtimeHubService';

const notificationHubService = {
    onReceiveNotification: (callback) => realtimeHubService.connection.on('ChangeNotification', callback),
    offReceiveNotification: () => realtimeHubService.connection.off('ChangeNotification'),
};

export default notificationHubService;
