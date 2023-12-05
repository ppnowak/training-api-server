# General API

## `GET /`

Returns list of all available endpoints.

```json
[
    "GET /time",
    ...
]
```

## `GET /time`

Returns current time as ISO timestamp

```json
{
    "time": "2023-12-05T19:27:31.969Z"
}
```

## `GET /ip`

Returns server & client IP.

```json
{
    "serverIp": "::ffff:127.0.0.1",
    "clientIp": "::ffff:127.0.0.1"
}
```

## `GET/POST/PATCH/PUT /mirror`

Mirrors request.

```json
POST /mirror?path=abcd HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json
Content-Length: 29

{
    "username": "admin"
}
```

```
{
    "method": "POST",
    "url": "/mirror?path=abcd",
    "headers": {
        "local-header": "Wartosc lokalna",
        "content-type": "application/json",
        "user-agent": "PostmanRuntime/7.35.0",
        "accept": "*/*",
        "host": "127.0.0.1:3000",
        "cache-control": "no-cache",
        "postman-token": "479515a8-9379-465c-ab2f-381b25ba0f3b",
        "accept-encoding": "gzip, deflate, br",
        "connection": "keep-alive",
        "content-length": "29"
    },
    "payload": {
        "username": "admin"
    }
}
```

## `POST /login`

Simulates login - sends JWT token on success request

Supported authentication methods:
- headers `x-username` & `x-password`
- query params `username` & `password`
- HTTP basic auth

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAxODA0NzQwLCJleHAiOjE3MDE4MDQ4MDB9.meQGNKdlqbMvgk5rC_72cdHg4MG9s8vKl45OUk-Jc7I"
}
```

## `GET /secret`

Simulates authentication protected resource.

Supported authentication methods:
- headers `x-username` & `x-password`
- query params `username` & `password`
- HTTP basic auth
- HTTP bearer with JWT token 

```json
{
    "secretData": "This is the secret data!"
}
```

## `GET /checkToken`

Takes JWT token from context (auth bearer) and reveals details. Similar as https://jwt.io/

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDE4MDQ3OTQsImV4cCI6MTcwMTgwNDg1NH0.fPSoO4CIJlkSgZoHqvU1jTaNtj6mhBQh5JHsgG4lXUY",
    "iat": 1701804794,
    "exp": 1701804854
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