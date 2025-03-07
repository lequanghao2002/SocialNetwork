import { useSelector } from 'react-redux';
import { selectedFriendIdSelector } from '~/features/chat/chatSelectors';
import Chat from '~/features/chat/components/Chat';
import DetailChat from '~/features/chat/components/DetailChat';
import ListChat from '~/features/chat/components/ListChat';

function Message() {
    const selectedFriendId = useSelector(selectedFriendIdSelector);
    console.log('selectedFriendId', selectedFriendId);
    return (
        <div style={{ display: 'flex', position: 'fixed', top: '60px', width: ' 100%' }}>
            <ListChat />
            {selectedFriendId && <Chat />}
            {selectedFriendId && <DetailChat />}
        </div>
    );
}

export default Message;
