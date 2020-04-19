import Initializer from "./views/Initializer";
import Login from "./views/Login";
import Lobby from "./views/Lobby";
import Game from "./views/Game";

const routes = [
    {
      path: '/',
      component: Initializer,
      label: 'Initializer'
    },
    {
        path: '/login',
        component: Login,
        label: 'Login'
    },
    {
        path: '/lobby',
        component: Lobby,
        label: 'Lobby'
    },
    {
        path: '/game/:id',
        component: Game,
        label: 'Game'
    }
]

export default routes;
