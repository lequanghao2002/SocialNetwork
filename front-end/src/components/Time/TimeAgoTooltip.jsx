import { Tooltip } from 'antd';
import { dateFormat } from '~/utils/dateFormat';

function TimeAgoTooltip({ date }) {
    return (
        <Tooltip title={dateFormat.fullDateTime(date)} placement="bottom">
            {dateFormat.timeFromNow(date)}
        </Tooltip>
    );
}

export default TimeAgoTooltip;
