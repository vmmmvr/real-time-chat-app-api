import { object, string, ref, boolean } from 'yup';

export const createRoomSchema = object({
  body: object({
    name: string().required('Room name is required'),
    private: boolean().required('Room status is required'),
    channeluuid: string().required('channel uuid is required'),
  }),
});

export const getRoomSchema = object({
  body: object({
    roomuuid: string().required('Room uuid is required'),
    channeluuid: string().required('channel uuid is required'),
  }),
});

export const getRoomsSchema = object({
  params: object({
    channeluuid: string().required('channel uuid is required'),
  }),
});

export const updateRoomSchema = object({
  params: object({
    roomuuid: string().required('Room uuid is required'),
  }),
});
export const deleteRoomSchema = object({
  params: object({
    roomuuid: string().required('Room uuid is required'),
  }),
});
