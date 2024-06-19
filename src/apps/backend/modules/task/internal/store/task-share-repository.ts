import { ApplicationRepository } from '../../../application';

import { TaskShareDB, TaskShareDbSchema } from './task-db';

const TaskShareRepository = ApplicationRepository<TaskShareDB>(
  'Task-Share',
  TaskShareDbSchema,
);

export default TaskShareRepository;
