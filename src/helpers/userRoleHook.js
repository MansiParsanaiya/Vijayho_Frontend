import { useState, useEffect } from 'react';
import { postApi } from './ApiMiddleware';
import { apiRoutes } from './api_routes';


const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const authUserString = localStorage.getItem('authUser');
        const authUser = JSON.parse(authUserString);
        const token = authUser.token;

        const result = await postApi(apiRoutes.userRole, {
          token: token
        });

        setUserRole(result.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();

  }, []);

  return userRole;
};

export default useUserRole;
