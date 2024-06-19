import { Schema, Types } from 'mongoose';

export interface TaskDB {
  _id: Types.ObjectId;
  account: Types.ObjectId;
  active: boolean;
  description: string;
  title: string;
  sharedTo: Types.ObjectId[];
}

export interface TaskShareDB {
  _id: Types.ObjectId;
  account: Types.ObjectId;
  task: Types.ObjectId;
  active: boolean;
}

export const TaskDbSchema: Schema = new Schema<TaskDB>(
  {
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    sharedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        index: true,
        default: []
      },
    ],
  },
  {
    collection: 'tasks',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);



export const TaskShareDbSchema: Schema = new Schema<TaskShareDB>(
  {
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'tasks',
      required: true,
    },
  },
  {
    collection: 'task-shares',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
