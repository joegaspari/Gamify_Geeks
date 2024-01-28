# Gamify Geeks Source folder

## Project Structure

Welcome to the source folder of the Gamify Geeks project. This is the main directory of the project.
It contains the Docker Copmose file along with the source code directories for the React application,
Node.js server and MySQl database setup.

All development-related files and directories are kept inside the 'src' folder to maintain a clear 
separation between source code, documentation and other project-related files or directories.
This structure helps to keep the project organized, especially as it grows in complexity.

---
## Getting started

Before you start, ensure you have the following intalled on your system:

- Docker: You can download it from [Docker's official website](https://www.docker.com/)
- Docker Compose: It comes pre-installed with Docker on windows and Mac and on the most recent version of Docker, Linux as well.

Make sure that the Docker daemon is running on your machine before you try to run any commands.

### Starting the application

Once you have all the previous steps completed, and have cloned the repo. You will need to create a .env file in both server and client folders, if you need the secret environment variables, message one of the team members

You can then navigate to the src directory:

`cd src`

Then use Docker Compose to build and start the services:

`docker-compose up -d`

This command will start all the services defined in the `docker-compose.yml` file in detached mode, meaning the containers will run in the background independently of your terminal

Due to the way Docker Compose starts services, the Node.js service might start before the MySQL service is fully ready.
If you see the following connection errors in the gamify-node service logs: 

```
[nodemon] starting `node app.js`
Server is running on port 8080
Unable to connect
```

You may need to restart the gamify-node service by clicking the restart button
or running the command in /src `docker-compose restat gamify-node`.

You will know the connection is successful if you see the following in the gamify-node service logs:
```
Server is running on port 8080
Executing (default): SELECT 1+1 AS result
Connection has been established!
```

The application should now be running and accessible on `http://localhost.8080` for the gamify-node
and `http://localhost:3000` for the gamify-react front-end.

To stop the application at any point you can simply go in the Docker GUI and click the Stop square button or run the command `docker-compose down`.
This command will stop and remove the containers
