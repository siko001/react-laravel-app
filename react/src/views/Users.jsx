import { Link } from 'react-router-dom';
import axiosClient from '../axiosClient';
import { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider';

export default function Users() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const { setNotification } = useStateContext();
	const [pagination, setPagination] = useState({
		first_page: null,
		first_page_url: null,
		current_page: null,
		last_page: null,
		last_page_url: null,
		next_page: null,
		next_page_url: null,
		prev_page: null,
		prev_page_url: null,
	});

	useEffect(() => {
		getUsers('/users');
	}, []);

	const onDelete = (u) => {
		if (!window.confirm('are you sure you want to delete this user?')) {
			return;
		}
		axiosClient.delete(`/users/${u.id}`).then(() => {
			setNotification('User Was Successfully Deleted');
			getUsers();
		});
	};

	const getUsers = (url) => {
		setLoading(true);
		axiosClient
			.get(url)
			.then(({ data }) => {
				setLoading(false);
				console.log(data);
				setUsers(data.data);
				setPagination({
					first_page: data.meta.links[1].label,
					first_page_url: data.links.first,

					current_page: data.meta.current_page,
					last_page_url: data.links.last,
					last_page: data.meta.last_page,

					next_page: data.meta.current_page + 1,
					next_page_url: data.links.next,

					prev_page: data.meta.current_page - 1,
					prev_page_url: data.links.prev,
				});
			})
			.catch(() => {
				setLoading(false);
			});
	};
	const currentPage = () => {
		return pagination.current_page;
	};

	const renderPaginationButtons = () => {
		return (
			!loading && (
				<div className="pagination">
					{pagination.first_page && pagination.current_page != pagination.first_page && pagination.current_page != 2 && (
						<button className="btn-page" onClick={() => getUsers(pagination.first_page_url)}>
							Go to First Page ({pagination.first_page}){' '}
						</button>
					)}
					{pagination.prev_page_url && (
						<button
							className="btn-page"
							onClick={() => {
								getUsers(pagination.prev_page_url);
							}}
						>
							Previous ({pagination.prev_page})
						</button>
					)}

					{pagination.next_page && pagination.current_page != pagination.last_page && (
						<button
							className="btn-page"
							onClick={() => {
								getUsers(pagination.next_page_url);
							}}
						>
							Next ({pagination.next_page})
						</button>
					)}
					{pagination.last_page &&
						pagination.current_page != pagination.last_page &&
						pagination.current_page != pagination.last_page - 1 && (
							<button className="btn-page" onClick={() => getUsers(pagination.last_page_url)}>
								Go to Last Page ({pagination.last_page})
							</button>
						)}
				</div>
			)
		);
	};

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px' }}>
				<h1>Users</h1>
				<Link className="btn-add" to="/users/new">
					Add New
				</Link>
			</div>
			<h5 style={{ marginLeft: '20px' }}>Page: {currentPage()}</h5>
			<div className="card animated fadeInDown">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Created Date</th>
							<th>Actions</th>
						</tr>
					</thead>
					{loading && (
						<tbody>
							<tr>
								<td colSpan="5" className="text-center">
									<div className="spinner"></div>
								</td>
							</tr>
						</tbody>
					)}
					{!loading && (
						<tbody>
							{users.map((u) => (
								<tr key={u.id}>
									<td>{u.id}</td>
									<td>{u.name}</td>
									<td>{u.email}</td>
									<td>{u.created_at}</td>
									<td>
										<Link className="btn btn-edit" to={`/users/${u.id}`}>
											Edit
										</Link>
										&nbsp;
										<button onClick={(ev) => onDelete(u)} className="btn btn-delete">
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
				{renderPaginationButtons()}
			</div>
		</div>
	);
}
