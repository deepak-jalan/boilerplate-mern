import { Types } from 'mongoose';
import {
  CreateTaskParams,
  DeleteTaskParams,
  Task,
  TaskShare,
  TaskNotFoundError,
  UpdateTaskParams,
  ShareTaskParams
} from '../types';

import TaskRepository from './store/task-repository';
import TaskShareRepository from './store/task-share-repository';
import TaskReader from './task-reader';
import TaskUtil from './task-util';

export default class TaskWriter {
  public static async createTask(params: CreateTaskParams): Promise<Task> {
    const createdTask = await TaskRepository.create({
      account: params.accountId,
      description: params.description,
      title: params.title,
      active: true,
    });
    return TaskUtil.convertTaskDBToTask(createdTask);
  }

  public static async updateTask(params: UpdateTaskParams): Promise<Task> {
    const task = await TaskRepository.findOneAndUpdate(
      {
        account: params.accountId,
        _id: params.taskId,
        active: true,
      },
      {
        $set: {
          description: params.description,
          title: params.title,
        },
      },
      { new: true },
    );

    if (!task) {
      throw new TaskNotFoundError(params.taskId);
    }

    return TaskUtil.convertTaskDBToTask(task);
  }

  public static async shareTask(params: ShareTaskParams): Promise<Task> {
    const sharedTo: Types.ObjectId[] = params.sharedTo.map(id => new Types.ObjectId(id));

    const task = await TaskRepository.findOneAndUpdate(
      {
        _id: params.taskId,
        active: true,
      },
      {
        $addToSet: { sharedTo: { $each: sharedTo } },
      },
      { new: true }
    );
    
    if (!task) {
      throw new TaskNotFoundError(params.taskId);
    }

    const taskShares: TaskShare[] = [];
    for (const sharedAccountId of params.sharedTo) {
      const taskShare: TaskShare = {
        task: params.taskId,
        account: sharedAccountId,
      };
      taskShares.push(taskShare);
    }
    await TaskShareRepository.insertMany(taskShares);

    return TaskUtil.convertTaskDBToTask(task);
  }



  public static async deleteTask(params: DeleteTaskParams): Promise<void> {
    const task = await TaskReader.getTaskForAccount({
      accountId: params.accountId,
      taskId: params.taskId,
    });

    await TaskRepository.findOneAndUpdate(
      {
        _id: task.id,
      },
      {
        $set: {
          active: false,
        },
      },
    );
  }
}
