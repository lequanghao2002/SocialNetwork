// Layouts
import { HeaderOnly } from '~/layouts';
import config from '~/config';

import Home from '~/pages/Home';
import Friend from '~/pages/Friend';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';
import Message from '~/pages/Message';
import Bookmark from '~/pages/Bookmark';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    //W{ path: '/friend', component: Friend },
    { path: config.routes.friend, component: Friend },
    //{ path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.search, component: Search, layout: null },
    { path: config.routes.message, component: Message },
    { path: config.routes.bookmark, component: Bookmark },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
