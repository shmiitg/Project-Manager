Following are the steps to run taskup on your local environment

1. Install all the required packages and dependencies.
  ```node
  npm install
  ```
2. Create a .env file in the same directory with the following configurations
  ```text
  DB_PASSWORD = <your mysql password>
  ``` 
  ``` 
  ACCESS_TOKEN_SECRET = <secret key for access token>
  ```
  ``` 
  DATABASE_URL = <your mysql url for connection>
  ```
3. Run the dev server.
  ```node
  npm run devStart
  ```
4. [Click here](http://localhost:5000) to see the backend server running in the browser OR navigate to
  ```text
  http://localhost:5000
  ```
5. To run the client, navigate into the client directory 
```
  cd client
  ```
 6. Run the client
   ```node
  npm start
  ```
7. [Click here](http://localhost:3000) to see the client running in the browser OR navigate to
  ```text
  http://localhost:3000
  ```