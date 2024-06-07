import React, { createContext, useState, useEffect } from 'react';

export const BranchContext = createContext();

const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]); 

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getApi(apiRoutes.getBranch);
        setBranches(response);
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    };
    fetchBranches();
  }, []);

  const addBranch = async (newBranchData) => {
    try {
      const response = await postApi(apiRoutes.addBranch, newBranchData);
      setBranches([...branches, response]); // Update context with new branch
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };

  return (
    <BranchContext.Provider value={ branches }>
      {children}
    </BranchContext.Provider>
  );
};

export default BranchProvider;
