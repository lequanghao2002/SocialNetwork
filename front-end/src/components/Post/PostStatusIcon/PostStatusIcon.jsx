import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAfrica, faUserGroup, faLock } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

function PostStatusIcon({ status }) {
    const statusMap = {
        1: { icon: faEarthAfrica, label: 'Public' },
        2: { icon: faUserGroup, label: 'Friend' },
        3: { icon: faLock, label: 'Private' },
    };

    if (!statusMap[status]) return null;

    return (
        <Tooltip title={statusMap[status].label} placement="bottom">
            <FontAwesomeIcon icon={statusMap[status].icon} />
        </Tooltip>
    );
}

export default PostStatusIcon;
