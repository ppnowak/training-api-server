# Running locally with NodeJS

Create `.env` file and put contents:
```
APP_PORT=<port>
USER_LOGIN=<login>
USER_PASSWORD=<password>
JWT_SECRET=<secret>
```

Install dependencies:
```
npm install
```

Start server with:
```
npm start
```

# Running with Docker image

Compile docker file:
```
docker build -t training-api-server .
```

Start server:
```
docker run -p <app_port>:<app_port> -e APP_PORT=<app_port> -e USER_LOGIN=<login> -e USER_PASSWORD=<password> -e JWT_SECRET=<secret> training-api-server
```

Example:
```
docker run -p 3000:3000 -e APP_PORT=3000 -e USER_LOGIN=admin -e USER_PASSWORD=admin1 -e JWT_SECRET=secret training-api-server
```

# Endpoints

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