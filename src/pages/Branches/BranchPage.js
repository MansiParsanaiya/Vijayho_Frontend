import React, { useState, useEffect, useMemo } from 'react';
import { CardBody, Container, Input, Label, Spinner, Table } from 'reactstrap';
import Breadcrumbs from 'components/Common/Breadcrumb';
import { Link } from 'react-router-dom';
import { apiRoutes } from 'helpers/api_routes';
import { getApi, postApi } from "helpers/ApiMiddleware";
import TableContainer from 'components/Common/TableContainer';
import * as Yup from "yup";


export default function BranchPage() {
  const [branchName, setBranchName] = useState('');
  const [branchCount, setBranchCount] = useState(0);
  const [branches, setbranches] = useState([])
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const validationSchema = Yup.object().shape({
    branchName: Yup.string()
      .required('Branch Name is required'),
  });


  useEffect(() => {
    fetchBranchCount();
  }, []);

  const fetchBranchCount = async () => {
    try {

      let url = `${apiRoutes.getBranch}`

      getApi(url).then(response => {

        setBranchCount(response.length);
        setbranches(response);
      }

      )
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('Error fetching income data:', error);
    }

  };




  console.log(branchCount, "i m m calling branchcount")

  const handleCreateBranch = async () => {
    setLoading(true);
    try {
      const newBranchId = branchCount + 1;
      console.log(newBranchId)
      const newBranchData = {
        branchName: branchName,
    };
      validationSchema.validate(newBranchData, { abortEarly: false })
        .then(response => {
          postApi(apiRoutes.addBranch, {
            branchId: newBranchId,
            name: newBranchData.branchName,
          })
            .then((response) => {
              console.log(response);
              console.log('Branch created successfully');
              setBranchName('');
              fetchBranchCount();
            })
            .catch(error => console.log('error', error));

          setErrors({});

        })
        .catch(error => {
          const validationErrors = {};
          if (error.inner) {
            error.inner.forEach((e) => {
              validationErrors[e.path] = e.message;
            });
          }
          setErrors(validationErrors);
          console.error('Validation Error:', errors);
        });


    } catch (error) {
      console.error('Error creating branch:', error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs title="EMS" breadcrumbItem="Create Branch" />
            <CardBody className="pt-0">
              <div className="p-2">
                <form className="form-horizontal">
                  <div className="mb-3">
                    <Label className="form-label">Branch's Name</Label>
                    <Input
                      type="text"
                      name="branchname"
                      className="form-control"
                      placeholder="Enter Branch's Name"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                    />
                    {errors.branchName && <div className="text-danger">{errors.branchName}</div>}

                  </div>

                  <div className="mt-4">
                    <button
                      className="btn btn-primary btn-block"
                      type="button"
                      onClick={handleCreateBranch}
                      disabled={loading}
                    >
                     {loading ? <Spinner size="sm" color="light" /> : 'Create Branch'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-4">
                <h5>Branches</h5>
                <Table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Sr.no</th>
                      <th>Branch Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch, index) => (
                      <tr key={index}>
                        <td>{branch.branchId}</td>
                        <td>{branch.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

            </CardBody>
          </Container>
        </div>
      </React.Fragment>
    </>
  );
}
