import * as signalR from '@microsoft/signalr';
import { getLocalStorage } from '~/utils/localStorage';

const hubUrl = import.meta.env.VITE_URL_REALTIME_HUB;

class RealtimeHubService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => getLocalStorage('token'),
                transport: signalR.HttpTransportType.WebSockets,
                skipNegotiation: true,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.eventHandlers = {};
    }

    async startConnection() {
        if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
            console.warn('⚠️ Chat Hub is already connected or connecting.');
            return;
        }

        try {
            await this.connection.start();
            console.log('✅ Chat Hub Connected.');
        } catch (err) {
            console.error('❌ Chat Hub Connection Error: ', err);
            //setTimeout(() => this.startConnection(), 5000); // Thử kết nối lại sau 5s
        }
    }

    stopConnection() {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            console.log('⚠️ Chat Hub Disconnected');
            this.connection.stop();
        }
    }
}

export const realtimeHubService = new RealtimeHubService();
