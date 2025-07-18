import test from 'node:test';
import assert from 'node:assert';
import {BASE_URL, testUser} from '../util/testUtils.js'

let userId;
let accessToken;

test('Full CRUD e2e flow', async (t) => {
  // Register
  const registerRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  assert.strictEqual(registerRes.status, 201, 'Register should return 201');
  const registeredUser = await registerRes.json();
  userId = registeredUser._id || registeredUser.id || registeredUser.user?._id || registeredUser.user?.id;
  assert.ok(userId, 'User ID should be present after registration');

  // Login
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  assert.strictEqual(loginRes.status, 200, 'Login should return 200');
  const loginData = await loginRes.json();
  accessToken = loginData.accessToken;
  assert.ok(accessToken, 'Access token should be present after login');

  // Get User By ID
  const getUserRes = await fetch(`${BASE_URL}/getUserById/${userId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  assert.strictEqual(getUserRes.status, 200, 'Get user by ID should return 200');
  const userData = await getUserRes.json();
  
  // Try to find the email in userData, whether it's a direct property or nested
  let fetchedEmail = userData.email;
  if (!fetchedEmail && userData.user) fetchedEmail = userData.user.email;
  if (!fetchedEmail && Array.isArray(userData) && userData[0]?.email) fetchedEmail = userData[0].email;
  assert.strictEqual(fetchedEmail, testUser.email, 'Fetched user email should match');

  // Update User
  const updatedName = 'Updated Test User';
  const updateRes = await fetch(`${BASE_URL}/updateUser/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ name: updatedName, password: testUser.password })
  });
  assert.strictEqual(updateRes.status, 200, 'Update user should return 200');
  const updatedUser = await updateRes.json();
  assert.strictEqual(updatedUser.name, updatedName, 'Updated user name should match');

  // Delete User
  const deleteRes = await fetch(`${BASE_URL}/deleteUser/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  assert.strictEqual(deleteRes.status, 200, 'Delete user should return 200');
  const deleteData = await deleteRes.json();
  assert.ok(deleteData.message?.includes('deleted'), 'Delete response should confirm deletion');
});
