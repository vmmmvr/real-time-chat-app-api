import { object, string, ref, boolean } from "yup";

export const createMessageSchema = object({
  body: object({
    message: string().required("Message is required"),
    senderuuid: string().required("Sender uuid is required"),
    roomuuid: string().required("Room uuid is required"),
    channeluuid: string().required("Channel uuid is required"),
  }),
});
