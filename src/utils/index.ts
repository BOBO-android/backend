import _ from 'lodash';
import Mongoose from 'mongoose';

export const getInfo = <T extends object, K extends keyof T>({
  object,
  fields,
}: {
  object: T;
  fields: K[];
}) => {
  return _.pick(object, fields) as Pick<T, K>;
};

export const omitInfo = <T extends object, K extends keyof T>({
  object,
  fields,
}: {
  object: T;
  fields: K[];
}) => {
  return _.omit(object, fields) as Omit<T, K>;
};

export const isValidObjectId = (id: string): boolean => {
  return Mongoose.isValidObjectId(id);
};

export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
