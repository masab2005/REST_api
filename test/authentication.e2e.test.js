import test from "node:test"
import assert from "node:assert"
import {BASE_URL, testUser} from '../util/testUtils.js';

let accessToken
let userId
test("does not get access to authenticate routes without token", async ()=>{
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
        method: 'GET'
      });
      assert.strictEqual(getUserRes.status, 401, 'Get user by ID should return 401 Unauthorized without proper token');

      //delete user
      const deleteRes = await fetch(`${BASE_URL}/deleteUser/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        assert.strictEqual(deleteRes.status, 200, 'Delete user should return 200');
        const deleteData = await deleteRes.json();
        assert.ok(deleteData.message?.includes('deleted'), 'Delete response should confirm deletion');
});