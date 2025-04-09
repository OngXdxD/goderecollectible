import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Spinner, 
  Alert 
} from 'react-bootstrap';
import Pageheader from "../../../shared/layout-components/pageheader/pageheader";
import Seo from "../../../shared/layout-components/seo/seo";
import { fetchWithTokenRefresh } from '../../../shared/utils/auth';

const UserManagement = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');

  // Fetch users and companies on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch users
        const usersResponse = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users`
        );
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        // Fetch companies
        const companiesResponse = await fetchWithTokenRefresh(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/companies/all`
        );
        
        if (!companiesResponse.ok) {
          throw new Error('Failed to fetch companies');
        }

        const usersData = await usersResponse.json();
        const companiesData = await companiesResponse.json();

        setUsers(usersData.users || []);
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
        
        console.log('Users data:', usersData.users);
        console.log('Companies data:', companiesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Open modal to assign company to user
  const handleAssignCompany = (user) => {
    setSelectedUser(user);
    // Set the initial selected company to the user's current company ID
    setSelectedCompany(user.company?.id || '');
    setShowModal(true);
  };

  // Close modal and reset selection
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setSelectedCompany('');
  };

  // Handle company selection change
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    console.log('Selected company ID:', companyId);
    setSelectedCompany(companyId);
  };

  // Submit company assignment
  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');
      
      if (!selectedUser) {
        throw new Error('No user selected');
      }

      console.log('Submitting company assignment:', {
        userId: selectedUser.id,
        companyId: selectedCompany
      });

      // Make API call to update user's company using the new endpoint
      const response = await fetchWithTokenRefresh(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/${selectedUser.id}/assign-company`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ companyId: selectedCompany || null }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign company');
      }

      // Update local state
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          const updatedUser = {
            ...user,
            company_id: selectedCompany || null,
            company: companies.find(c => c.id === selectedCompany) || null
          };
          console.log('Updated user:', updatedUser);
          return updatedUser;
        }
        return user;
      }));

      setSuccess('User successfully assigned to company');
      
      // Close modal after successful assignment
      setTimeout(() => {
        handleCloseModal();
        setSuccess('');
      }, 2000);
      
    } catch (err) {
      console.error('Error assigning company:', err);
      setError('Failed to assign company. Please try again.');
    }
  };

  // Get company name
  const getCompanyName = (user) => {
    if (!user.company) return 'Not assigned';
    return user.company.name;
  };

  // Get user role name
  const getUserRole = (user) => {
    if (!user.role) return 'Unknown';
    return user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1);
  };

  return (
    <>
      <Seo title="User Management" />
      <div>
        <Pageheader title="USER MANAGEMENT" heading="Settings" active="User Management" />
        
        <Container>
          <Row className="row-sm">
            <Col md={12}>
              <Card className="custom-card">
                <Card.Header>
                  <h6 className="main-content-label mb-0">Manage Users</h6>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  
                  {loading ? (
                    <div className="text-center my-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <Table responsive bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Company</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">No users found</td>
                          </tr>
                        ) : (
                          users.map((user, index) => (
                            <tr key={user.id}>
                              <td>{index + 1}</td>
                              <td>{user.name || 'N/A'}</td>
                              <td>{user.email}</td>
                              <td>{getUserRole(user)}</td>
                              <td>{getCompanyName(user)}</td>
                              <td>
                                <Button 
                                  variant="primary" 
                                  size="sm"
                                  onClick={() => handleAssignCompany(user)}
                                >
                                  Assign Company
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Modal for assigning company */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Assign Company</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            {selectedUser && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>User</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={selectedUser.name || selectedUser.email} 
                    disabled 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Current Company</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={getCompanyName(selectedUser)} 
                    disabled 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Select New Company</Form.Label>
                  <Form.Select 
                    value={selectedCompany} 
                    onChange={handleCompanyChange}
                    className="form-select"
                  >
                    <option value="">Not Assigned</option>
                    {companies.map(company => (
                      <option 
                        key={company.id} 
                        value={company.id}
                      >
                        {company.name} - {company.registration_number || 'No Registration'}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {selectedCompany && (
                  <div className="mt-3">
                    <h6>Selected Company Details:</h6>
                    {(() => {
                      const selectedCompanyData = companies.find(c => c.id === selectedCompany);
                      return selectedCompanyData ? (
                        <div className="p-3 bg-light rounded">
                          <p className="mb-1"><strong>Name:</strong> {selectedCompanyData.name}</p>
                          <p className="mb-1"><strong>Registration:</strong> {selectedCompanyData.registration_number || 'N/A'}</p>
                          <p className="mb-1"><strong>Address:</strong> {selectedCompanyData.address || 'N/A'}</p>
                          <p className="mb-0"><strong>Phone:</strong> {selectedCompanyData.phone || 'N/A'}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

UserManagement.layout = "Contentlayout";

export default UserManagement; 