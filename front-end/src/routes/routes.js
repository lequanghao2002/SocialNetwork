// Layouts
import { HeaderOnly } from '~/layouts';
import config from '~/config';

import Home from '~/pages/Home';
import Friend from '~/pages/Friend';
import Upload from '~/pages/Upload';
import Search from '~/pages/Search';
import Message from '~/pages/Message';
import Bookmark from '~/pages/Bookmark';
import Login from '~/pages/Login';
import Profile from '~/pages/Profile';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    //W{ path: '/friend', component: Friend },
    { path: config.routes.friend, component: Friend },
    //{ path: config.routes.upload, component: Upload, layout: HeaderOnly },
    { path: config.routes.search, component: Search },
    //{ path: config.routes.message, component: Message },
    { path: config.routes.message, component: Message, layout: HeaderOnly },
    { path: config.routes.bookmark, component: Bookmark },
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.profile, component: Profile, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
