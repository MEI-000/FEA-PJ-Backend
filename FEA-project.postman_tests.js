// Utility function - Send request
const sendRequest = (options) => {
  return new Promise((resolve, reject) => {
    pm.sendRequest(options, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

// 1. Auth module
const testAuthModule = async () => {
  // Register test user
  const randomSuffix = Math.floor(Math.random() * 10000);
  const registerData = {
    username: `testuser_${randomSuffix}`,
    email: `test${randomSuffix}@example.com`,
    password: 'Test123',
  };

  const registerResponse = await sendRequest({
    url: 'http://localhost:3001/auth/register',
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: { mode: 'raw', raw: JSON.stringify(registerData) },
  });

  console.log('Register Response:', registerResponse.json());
  pm.test('Register - Status 201', () =>
    pm.expect(registerResponse.code).to.equal(201),
  );

  // Login to get token
  const loginResponse = await sendRequest({
    url: 'http://localhost:3001/auth/login',
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        email: registerData.email,
        password: registerData.password,
      }),
    },
  });

  console.log('Login Response:', loginResponse.json());
  pm.test('Login - Status 200', () =>
    pm.expect(loginResponse.code).to.equal(201),
  );

  const loginData = loginResponse.json();
  return {
    accessToken: loginData.token,
    userId: loginData.user.id,
    username: loginData.user.username,
    email: registerData.email,
  };
};

// 2. User module
const testUserModule = async (authData) => {
  // Get user profile
  const profileResponse = await sendRequest({
    url: 'http://localhost:3001/users/profile',
    method: 'GET',
    header: { Authorization: `Bearer ${authData.accessToken}` },
  });

  console.log('Profile GET Response:', profileResponse.json());
  pm.test('Get Profile - Status 200', () =>
    pm.expect(profileResponse.code).to.equal(200),
  );

  const profileData = profileResponse.json();
  const originalUsername = profileData.username;

  // Update user profile
  const updateResponse = await sendRequest({
    url: 'http://localhost:3001/users/profile',
    method: 'PATCH',
    header: {
      Authorization: `Bearer ${authData.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        username: `updated_${originalUsername}`,
        contact: '123-456-7890',
        preference: 'dark mode',
      }),
    },
  });

  console.log('Profile PATCH Response:', updateResponse.json());
  pm.test('Update Profile - Status 200', () =>
    pm.expect(updateResponse.code).to.equal(200),
  );

  // Restore original username
  await sendRequest({
    url: 'http://localhost:3001/users/profile',
    method: 'PATCH',
    header: {
      Authorization: `Bearer ${authData.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: {
      mode: 'raw',
      raw: JSON.stringify({ username: originalUsername }),
    },
  });

  return authData; // Continue passing auth data
};

// 3. Tweets module
const testTweetsModule = async (authData) => {
  let createdTweetId, createdRetweetId;

  // 1. Create new tweet
  const createTweetResponse = await sendRequest({
    url: 'http://localhost:3001/tweets',
    method: 'POST',
    header: { Authorization: `Bearer ${authData.accessToken}` },
    body: {
      mode: 'formdata',
      formdata: [
        {
          key: 'content',
          value: 'Test tweet from automated script',
        },
      ],
    },
  });

  console.log('Create Tweet Response:', createTweetResponse.json());
  pm.test('Create Tweet - Status 201', () =>
    pm.expect(createTweetResponse.code).to.equal(201),
  );

  createdTweetId = createTweetResponse.json()._id;

  // 2. Like tweet
  const likeResponse = await sendRequest({
    url: `http://localhost:3001/tweets/${createdTweetId}/like`,
    method: 'POST',
    header: { Authorization: `Bearer ${authData.accessToken}` },
  });

  console.log('Like Response:', likeResponse.json());
  pm.test('Like Tweet - Status 201', () =>
    pm.expect(likeResponse.code).to.equal(201),
  );

  // 3. Retweet
  const retweetResponse = await sendRequest({
    url: `http://localhost:3001/tweets/${createdTweetId}/retweet`,
    method: 'POST',
    header: { Authorization: `Bearer ${authData.accessToken}` },
  });

  console.log('Retweet Response:', retweetResponse.json());
  pm.test('Retweet - Status 201', () =>
    pm.expect(retweetResponse.code).to.equal(201),
  );

  createdRetweetId = retweetResponse.json()._id;

  // 4. Get single tweet
  const singleTweetResponse = await sendRequest({
    url: `http://localhost:3001/tweets/${createdTweetId}`,
    method: 'GET',
    header: { Authorization: `Bearer ${authData.accessToken}` },
  });

  console.log('Single Tweet Response:', singleTweetResponse.json());
  pm.test('Get Single Tweet - Status 200', () =>
    pm.expect(singleTweetResponse.code).to.equal(200),
  );

  // 5. Get my tweets
  const myTweetsResponse = await sendRequest({
    url: 'http://localhost:3001/tweets/mine',
    method: 'GET',
    header: { Authorization: `Bearer ${authData.accessToken}` },
  });

  console.log('My Tweets Response:', myTweetsResponse.json());
  pm.test('Get My Tweets - Status 200', () =>
    pm.expect(myTweetsResponse.code).to.equal(200),
  );

  // 6. Get all tweets
  const tweetsResponse = await sendRequest({
    url: 'http://localhost:3001/tweets',
    method: 'GET',
  });

  console.log('Tweets GET Response:', tweetsResponse.json());
  pm.test('Get Tweets - Status 200', () =>
    pm.expect(tweetsResponse.code).to.equal(200),
  );

  return { ...authData, createdTweetId, createdRetweetId };
};

// 4. Notifications module
const testNotificationsModule = async (testData) => {
  // Get notifications
  const notificationsResponse = await sendRequest({
    url: 'http://localhost:3001/notifications',
    method: 'GET',
    header: { Authorization: `Bearer ${testData.accessToken}` },
  });

  console.log('Notifications Response:', notificationsResponse.json());
  pm.test('Get Notifications - Status 200', () =>
    pm.expect(notificationsResponse.code).to.equal(200),
  );

  const notifications = notificationsResponse.json();
  if (notifications.length === 0) {
    console.log('No notifications found to test');
    return testData;
  }

  const sampleNotificationId = notifications[0]._id;

  // Mark notification as read
  const markReadResponse = await sendRequest({
    url: `http://localhost:3001/notifications/${sampleNotificationId}/read`,
    method: 'PATCH',
    header: { Authorization: `Bearer ${testData.accessToken}` },
  });

  console.log('Mark Read Response:', markReadResponse.json());
  pm.test('Mark Notification Read - Status 200', () =>
    pm.expect(markReadResponse.code).to.equal(200),
  );

  return testData;
};

// Main test flow
(async () => {
  try {
    // 1. Test auth module
    const authData = await testAuthModule();

    // 2. Test user module
    const userData = await testUserModule(authData);

    // 3. Test tweets module
    const tweetsData = await testTweetsModule(userData);

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
})();
