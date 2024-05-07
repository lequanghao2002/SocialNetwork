// Layouts
import { HeaderOnly } from '~/components/Layout';

import Home from '~/pages/Home';
import Friend from '~/pages/Friend';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/friend', component: Friend },
    { path: '/upload', component: Upload, layout: HeaderOnly },
    { path: '/search', component: Search, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
