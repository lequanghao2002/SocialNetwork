import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedFriendIdSelector } from '~/features/chat/chatSelector';
import { addMessageToChat, updateMessageInChat } from '~/features/chat/chatSlice';
import Chat from '~/features/chat/components/Chat';
import DetailChat from '~/features/chat/components/DetailChat';
import ListChat from '~/features/chat/components/ListChat';
import chatHubService from '~/sockets/chatHubService';

function Message() {
    const dispatch = useDispatch();
    const selectedFriendId = useSelector(selectedFriendIdSelector);

    useEffect(() => {
        chatHubService.onReceiveMessage((message) => {
            dispatch(addMessageToChat(message));
        });

        chatHubService.onUpdatedMessage((message) => {
            dispatch(updateMessageInChat(message));
        });
    }, []);

    return (
        <div style={{ display: 'flex', position: 'fixed', top: '60px', width: ' 100%' }}>
            <ListChat />
            {selectedFriendId && <Chat />}
            {selectedFriendId && <DetailChat />}
        </div>
    );
}

export default Message;
