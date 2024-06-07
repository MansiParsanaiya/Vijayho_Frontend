import { useState, useEffect } from 'react';
import { postApi } from './ApiMiddleware';
import { apiRoutes } from './api_routes';


const userActive = () => {
  const [userActive, setuserActive] = useState(null);

  useEffect(() => {
    const fetchUserActive = async () => {
      try {
        const authUserString = localStorage.getItem('authUser');
        const authUser = JSON.parse(authUserString);
        const token = authUser.token;

        const result = await postApi(apiRoutes.getUserWithActive, {
          email: authUser.email
        });

        

        setuserActive(result.user.isActive);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserActive();

  }, []);

  return userActive;
};

export default userActive;
