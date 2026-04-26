import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getProducts = async () => {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const decreaseStock = async (productId, variantIndex, size) => {
  const ref = doc(db, "products", productId);
  const snap = await getDoc(ref);

  const data = snap.data();

  if (data.variants[variantIndex].sizes[size] > 0) {
    data.variants[variantIndex].sizes[size]--;
  }

  await updateDoc(ref, { variants: data.variants });
};

export const increaseStock = async (productId, variantIndex, size) => {
  const ref = doc(db, "products", productId);
  const snap = await getDoc(ref);

  const data = snap.data();
  data.variants[variantIndex].sizes[size]++;

  await updateDoc(ref, { variants: data.variants });
};