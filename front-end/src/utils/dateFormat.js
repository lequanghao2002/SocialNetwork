import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/en';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    relativeTime: {
        future: '%s', // Xóa "in" phía trước
        past: '%s', // Xóa "ago" phía sau
        s: 'few sec',
        m: '1 min',
        mm: '%d min',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1mo',
        MM: '%dmo',
        y: '1y',
        yy: '%dy',
    },
});

export const dateFormat = {
    timeFromNow: (date) => dayjs.utc(date).fromNow(),
    formatDateTime: (date) => dayjs.utc(date).local().format('DD/MM/YYYY HH:mm'),
    fullDateTime: (date) => dayjs.utc(date).local().format('dddd, DD/MM/YYYY HH:mm:ss'),
};
