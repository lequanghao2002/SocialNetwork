import { faChevronDown, faEarthAsia, faLock, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, Space } from 'antd';

const items = [
    {
        key: 1,
        label: 'Public',
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
    },
    {
        key: 2,
        label: 'Friend',
        icon: <FontAwesomeIcon icon={faUserGroup} />,
    },
    {
        key: 3,
        label: 'Private',
        icon: <FontAwesomeIcon icon={faLock} />,
    },
];

function PostStatusField({ value, onChange }) {
    const selectedItem = items.find((item) => item.key === value);

    const handleStatusClick = ({ key }) => {
        onChange(Number(key));
    };

    return (
        <Dropdown
            menu={{
                items,
                onClick: handleStatusClick,
            }}
        >
            <Button className="customButton">
                {selectedItem && (
                    <Space>
                        {selectedItem.icon}
                        {selectedItem.label}
                        <FontAwesomeIcon icon={faChevronDown} />
                    </Space>
                )}
            </Button>
        </Dropdown>
    );
}

export default PostStatusField;
