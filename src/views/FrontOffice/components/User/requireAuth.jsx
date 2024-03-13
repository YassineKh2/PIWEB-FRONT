import { jwtDecode } from 'jwt-decode';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  let USER;
  const location = useLocation();

  if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    USER = decodedToken;
  }

  return USER ? (
    allowedRoles ? (
      allowedRoles.find(r => r === USER.role) ? (
        <Outlet />
      ) : (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      )
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;