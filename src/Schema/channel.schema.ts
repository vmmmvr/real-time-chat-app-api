import { object, string, ref, boolean } from 'yup';

export const createChannelSchema = object({
  body: object({
    name: string().required('channel name is required'),
    private: boolean().required('channel status is required'),
  }),
});

export const updateChannelSchema = object({
  params: object({
    uuid: string().required('channel uuid is required'),
  }),
  body: object({
    name: string().required('channel name is required'),
    private: boolean().required('channel status is required'),
  }),
});

export const joinChannelSchema = object({
  body: object({
    uuid: string().required('channel uuid is required'),
  }),
});
