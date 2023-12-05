DISCLAIMER! The code on this repository serves only API for training purposes. It does not show good practices on how to design and implement API.

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