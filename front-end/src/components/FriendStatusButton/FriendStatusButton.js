import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faUserCheck, faUserPlus, faUserXmark } from '@fortawesome/free-solid-svg-icons';

function FriendStatusButton() {
    return (
        <>
            <Button primary leftIcon={<FontAwesomeIcon icon={faUserPlus} />}>
                Add friend
            </Button>
            <Button primary leftIcon={<FontAwesomeIcon icon={faUserXmark} />}>
                Cancel request
            </Button>
            <Button primary leftIcon={<FontAwesomeIcon icon={faUserCheck} />}>
                Friend
            </Button>
            <Button leftIcon={<FontAwesomeIcon icon={faCommentDots} />}>Message</Button>
        </>
    );
}

export default FriendStatusButton;
