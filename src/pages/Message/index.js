import { useContext } from 'react';
import Chat from '~/components/Chat';
import DetailChat from '~/components/DetailChat';
import ListChat from '~/components/ListChat';
import { ChatContext } from '~/context/ChatProvider';

function Message() {
    const { chatId } = useContext(ChatContext);

    return (
        <div style={{ display: 'flex', position: 'fixed', top: '60px', width: ' 100%' }}>
            <ListChat />
            {/* <Chat />
            <DetailChat /> */}
            {chatId && <Chat />}
            {chatId && <DetailChat />}
        </div>
    );
}

export default Message;
