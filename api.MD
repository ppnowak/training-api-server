# General API

## `GET /info`

Returns list with all available endpoints.

Example:
```
[
    "GET /time",
    "GET /ip",
    "GET /mirror",
    "PATCH /mirror",
    "POST /mirror",
    "PUT /mirror",
    "GET /info",
    "POST /login",
    "GET /secret",
    "GET /checkToken"
]
```

## `GET /ip`

Returns server & client IP as JSON object.

Example:
```
{
    "serverIp": "::ffff:172.17.0.2",
    "clientIp": "::ffff:172.17.0.1"
}
```

## `GET /time`

Returns current time as ISO timestamp.

Example:
```
{
    "time": "2023-12-02T20:59:56.451Z"
}
```

## `* /mirror`

Mirrors any request. Shows all request data in the response.

### Example 1
Request:
```
GET /mirror HTTP/1.1
Host: 127.0.0.1:3000
```

Response:
```
{
    "method": "GET",
    "url": "/mirror",
    "headers": {
        "user-agent": "PostmanRuntime/7.35.0",
        "accept": "*/*",
        "cache-control": "no-cache",
        "postman-token": "80854cc7-0b1a-467a-93af-1f50b615e166",
        "host": "127.0.0.1:3000",
        "accept-encoding": "gzip, deflate, br",
        "connection": "keep-alive"
    },
    "payload": {}
}
```

### Example 2
Request:
```
POST /mirror HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Content-Length: 42

{"username": "admin", "password": "admin"}
```

Response:
```
{
    "method": "POST",
    "url": "/mirror",
    "headers": {
        "content-type": "application/json",
        "user-agent": "PostmanRuntime/7.35.0",
        "accept": "*/*",
        "cache-control": "no-cache",
        "postman-token": "26a46e6c-6858-45e9-88e5-43d6e7a630e4",
        "host": "127.0.0.1:3000",
        "accept-encoding": "gzip, deflate, br",
        "connection": "keep-alive",
        "content-length": "42"
    },
    "payload": {
        "username": "admin",
        "password": "admin"
    }
}
```

## POST /login

Simulates login action, returns JWT key as the response.

Implemented authorization types:
- Basic HTTP login
- `x-username` & `x-password` headers
- Query parameters `username` & `password`

Example:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAxNTQ5NzU2LCJleHAiOjE3MDE1NDk4MTZ9.Y-3k6hRyVfZ5hh1Z_92gZHd503YxptwT-KmpQb7Gztw"
}
```

## GET /secret

Simulates protected endpoint. Can be accessible with one of authorization types:
- Basic HTTP login
- `x-username` & `x-password` headers
- Query parameters `username` & `password`
- JWT token from `POST /login`

Response:
```
{
    "secretData": "This is the secret data!"
}
```

## `GET /checkToken`

Shows JWT token details (takes token from authorization header)

Response:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAxNTQ5NzU2LCJleHAiOjE3MDE1NDk4MTZ9.Y-3k6hRyVfZ5hh1Z_92gZHd503YxptwT-KmpQb7Gztw",
    "username": "admin",
    "iat": 1701549715,
    "exp": 1701549775
}
```

## `GET /redirect`

Simulates HTTP 301 redirect. New URL is `GET /time`

# Users API

## `GET /users`

Shows list of all registered users.

Query params adds support for search, sorting and hidden options:
- `id` - lookup
- `firstName` - case insensitive lookup
- `lastName` - case insensitive lookup
- `status` - lookup
- `registrationDateFrom` - date range lookup
- `registrationDateTo` - date range lookup
- `addressStreet` - case insensitive lookup
- `sortBy` - ascending sort by given field name
- `limit` - limits results size
- `showAddress` - shows addresses hidden by default in this view

Sends additional headers in response:
- `X-Total-Count` - total number of results (before filtering)
- `X-Filtered-Count` - total number of results (after filtering)

```json
[
    {
        "id": 1,
        "firstName": "Piotr",
        "lastName": "Nowak",
        "registrationDate": "2023-10-17T09:55:21.845Z",
        "status": "Active"
    },
    {
        "id": 2,
        "firstName": "Anna",
        "lastName": "Kowalska",
        "registrationDate": "2023-07-29T03:33:42.954Z",
        "status": "Pending"
    }
]
```

## `POST /user`

Adds new user. Request schema:
```json
{
    "firstName": "<required>",
    "lastName": "<required>",
    "address": {
        "street": "<required>",
        "city": "<required>",
        "zipCode": "<required>"
    }
}
```

Response:
```json
{
    "userId": 21
}
```

## `PUT /user/:userId`

Overrides existing user data. Request schema:
```json
{
    "firstName": "<required>",
    "lastName": "<required>",
    "address": {
        "street": "<required>",
        "city": "<required>",
        "zipCode": "<required>"
    }
}
```

Response: new user data, same as for `GET /users/:userId`

## `PATCH /user/:userId`

Overrides part of user data. Request schema:
```json
{
    "firstName": "<optional>",
    "lastName": "<optional>",
    "address": {
        "street": "<optional>",
        "city": "<optional>",
        "zipCode": "<optional>"
    }
}
```

Response: new user data, same as for `GET /users/:userId`

## `GET /user/:userId`

Shows user details.
```json
{
    "id": 21,
    "firstName": "Sophia",
    "lastName": "Reichert",
    "registrationDate": "2023-12-05T19:42:43.336Z",
    "status": "Pending",
    "address": {
        "street": "086 Lucy Valleys",
        "city": "Schulistland",
        "zipCode": "36-567"
    }
}
```

## `DELETE /users/:id`

Marks user with given id as Deleted (soft deletion).

## `DELETE /users/:id?permanent=true`

Deletes user with given id (hard deletion).