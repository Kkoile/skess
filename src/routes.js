import Lobby from "./views/Lobby";
import Game from "./views/Game";

const routes = [
    {
        path: '/',
        component: Lobby,
        label: 'Lobby'
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
