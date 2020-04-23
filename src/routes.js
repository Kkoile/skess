import Lobby from "./views/Lobby";
import Game from "./views/Game";
import Impressum from "./views/Impressum";

const routes = [
    {
        path: '/',
        component: Lobby,
        label: 'Lobby'
    },
    {
        path: '/impressum',
        component: Impressum,
        label: 'Impressum'
    },
    {
        path: '/game/:id',
        component: Game,
        label: 'Game'
    },
    {
        component: ({history}) => {
            history.replace('/');
            return 'Redirecting...';
        }
    }
]

export default routes;
