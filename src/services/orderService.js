import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export const createOrder = async (order) => {
  return await addDoc(collection(db, "orders"), {
    ...order,
    status: "nouveau",
    createdAt: new Date()
  });
};