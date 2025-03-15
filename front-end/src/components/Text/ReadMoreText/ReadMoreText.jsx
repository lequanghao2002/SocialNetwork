import { Typography } from 'antd';

function ReadMoreText({ text, rows = 2 }) {
    return (
        <Typography.Paragraph ellipsis={{ rows: rows, expandable: true, symbol: 'more' }} style={{ marginBottom: 0 }}>
            {text}
        </Typography.Paragraph>
    );
}

export default ReadMoreText;
