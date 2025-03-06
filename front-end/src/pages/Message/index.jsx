import { useContext } from 'react';
import Chat from '~/components/Chat';
import DetailChat from '~/components/DetailChat';
import ListChat from '~/components/ListChat';
import ChatContext from '~/context/ChatContext/chatContext';

function Message() {
    const { selectedFriendId } = useContext(ChatContext);
    return (
        <div style={{ display: 'flex', position: 'fixed', top: '60px', width: ' 100%' }}>
            <ListChat />
            {selectedFriendId && <Chat />}
            {selectedFriendId && <DetailChat />}
        </div>
    );
}

export default Message;
