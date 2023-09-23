import { Navigate, createBrowserRouter } from 'react-router-dom';
import Login from './views/Login';
import Users from './views/Users';
import Signup from './views/Signup';
import NotFound from './views/NotFound';
import DashBoard from './views/DashBoard';
import GuestLayout from './components/GuestLayout';
import DefaultLayout from './components/DefaultLayout';
import UserForm from './views/UserForm';

const router = createBrowserRouter([
	{
		path: '/',
		element: <DefaultLayout />,
		children: [
			{
				path: '/',
				element: <Navigate to="/users" />,
			},
			{
				path: '/users',
				element: <Users />,
			},
			{
				path: '/dashboard',
				element: <DashBoard />,
			},
			{
				path: '/users/new',
				element: <UserForm key="userCreate" />,
			},
			{
				path: '/users/:id',
				element: <UserForm key="userUpdate" />,
			},
		],
	},

	{
		path: '/',
		element: <GuestLayout />,
		children: [
			{
				path: '/login',
				element: <Login />,
			},

			{
				path: '/signup',
				element: <Signup />,
			},
		],
	},

	{
		path: '*',
		element: <NotFound />,
	},
]);

export default router;
