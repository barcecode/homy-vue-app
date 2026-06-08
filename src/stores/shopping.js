import { defineStore } from "pinia";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where, writeBatch } from "firebase/firestore";
import { useCollection, useFirestore } from "vuefire";
import { useHouseStore } from "./house";
import { useUserStore } from "./user";
import { computed } from "vue";

export const useShoppingStore = defineStore('shopping', () => {
  const house = useHouseStore()
  const user = useUserStore()
  const db = useFirestore()

  const deleteList = async (listId) => {
    try {
      console.log(listId)
      const itemsRef = collection(db, "shopping_list_item");
      const q = query(itemsRef, where("list_id", "==", listId));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);
      querySnapshot.forEach((documento) => {
        batch.delete(documento.ref);
      });
      await batch.commit();

      await deleteDoc(doc(db, "shopping_list", listId));

      console.log("Lista e ítems eliminados correctamente");
      return true;
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
      return false;
    }
  };

  const listsRef = collection(db, 'shopping_list');
  const q = computed(() =>
    house.currentHouseInfo?.id ? query(listsRef, where('house_id', '==', house.currentHouseInfo.id), orderBy('created_at', 'desc')) : null
  );

  const shoppingLists = useCollection(q);

  const createList = async (name, description = "", color = '#FFFFFF') => {
    console.log(house.currentHouseInfo.house_id)
    try {
      const docRef = await addDoc(collection(db, "shopping_list"), {
        name,
        description,
        color,
        house_id: house.currentHouseInfo.id,
        created_by: user.currentUserInfo.name,
        created_at: serverTimestamp()
      });
      return docRef.id;
    } catch (e) {
      console.error("Error creando lista:", e);
    }
  };

  return {
    shoppingLists,
    createList,
    deleteList
  }

})
