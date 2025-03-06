import * as signalR from '@microsoft/signalr';
import { getLocalStorage } from '~/utils/localStorage';

const hubUrl = import.meta.env.VITE_URL_CHATHUB;

class ChatHubService {
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
    }

    async startConnection() {
        if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
            console.warn('⚠️ SignalR is already connected or connecting.');
            return;
        }

        try {
            await this.connection.start();
            console.log('✅ SignalR Connected.');
        } catch (err) {
            console.error('❌ SignalR Connection Error: ', err);
            //setTimeout(() => this.startConnection(), 5000); // Thử kết nối lại sau 5s
        }
    }

    // Lắng nghe tin nhắn từ server
    // Đăng ký một callback để xử lý tin nhắn từ server.
    // Khi server gửi sự kiện "ReceiveMessage", callback sẽ được gọi với dữ liệu tin nhắn.
    onReceiveMessage(callback) {
        this.connection.on('ReceiveMessage', callback);
    }

    onMessageUpdated(callback) {
        this.connection.on('MessageUpdated', callback);
    }

    // Gửi tin nhắn lên server
    // Dùng this.connection.invoke() để gọi hàm trên server có tên "SendMessage".
    // Trả về một Promise, giúp xử lý async nếu cần
    sendMessage(message) {
        return this.connection.invoke('SendMessage', message);
    }

    updateMessage(message) {
        return this.connection.invoke('UpdateMessage', message);
    }

    deleteMessage(message) {
        return this.connection.invoke('DeleteMessage', message);
    }

    stopConnection() {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            this.connection.stop();
        }
    }
}

export const chatHubService = new ChatHubService();
