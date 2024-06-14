import Chat from '~/components/Chat';
import DetailChat from '~/components/DetailChat';
import ListChat from '~/components/ListChat';

function Message() {
    return (
        <div style={{ display: 'flex', position: 'fixed', top: '60px' }}>
            <ListChat />
            <Chat />
            <DetailChat />
        </div>
    );
}

export default Message;
