import PostDetailModal from './PostModal/PostDetailModal';
import PostModal from './PostModal/PostModal';
import ProfileDetailModal from './ProfileModal/ProfileDetailModal';
import ProfileInfoModal from './ProfileModal/ProfileInfoModal';

function Modals() {
    return (
        <>
            <PostModal />
            <PostDetailModal />

            <ProfileInfoModal />
            <ProfileDetailModal />
        </>
    );
}

export default Modals;
