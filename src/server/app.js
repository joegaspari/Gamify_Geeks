import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import config from './config.js';
import Users from './models/users.js';
import sequelize from './models/database.js';
import authRouter from './router/auth.js';
import Learner from './models/learner.js';
import Instructor from './models/instructor.js';
import setAssocations from './models/associations.js';
import profileRouter from './router/profile.js';
import dashboardRouter from './router/dashboard.js';
import topicRouter from './router/topics.js';
import questionRouter from './router/questions.js';
import mockDataRouter from './router/mockData.js';
import instructorRouter from './router/instructor.js';
import moduleRouter from './router/modules.js';
import assignmentRouter from './router/assignments.js';
import studentRouter from './router/student.js';


const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/dashboard', dashboardRouter);
app.use('/explore', topicRouter);
app.use('/question', questionRouter);
app.use('/mockData', mockDataRouter);
app.use('/instructor', instructorRouter);
app.use('/classModule', moduleRouter);
app.use('/assignment', assignmentRouter);
app.use('/student', studentRouter);

app.get('/', (req, res) => {
  res.json({ test: 'Hello World!!!' });
});

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((error, req, res) => {
  console.error(error);
  res.sendStatus(500);
});

if(process.env.NODE_ENV !== 'test'){
  app.listen(config.host.port, () => {
    console.log(`Server is running on port ${config.host.port}`);
  });
}


sequelize.authenticate().then(()=>{
  console.log('Connection has been established!');

}).catch(err=>{
  console.error('Unable to connect');
});

setAssocations();

export default app;