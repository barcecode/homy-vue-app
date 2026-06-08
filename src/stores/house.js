import { defineStore } from "pinia"
import { useUserStore } from "./user";
import { useDocument, useFirestore } from "vuefire";
import { computed } from "vue";
import { doc } from "firebase/firestore";


export const useHouseStore = defineStore('house', () => {
  const db = useFirestore()
  const user = useUserStore()
  const currentHouseInfo = useDocument(
    computed(() =>
      user.currentUserInfo ? doc(db, "house", user.currentUserInfo.house_id) : null
    )
  );

  return {
    currentHouseInfo
  }
})
