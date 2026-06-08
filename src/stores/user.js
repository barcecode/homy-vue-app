import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { collection, doc, getDocs, query, runTransaction, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useAuthStore } from "./auth";
import { useDocument, useFirestore } from "vuefire";
import { generateInviteCode } from "@/utils/helpers";
import { useRouter } from "vue-router";

export const useUserStore = defineStore('user', () => {
  const auth = useAuthStore()
  const db = useFirestore()
  const errorMsg = ref('');

  const router = useRouter()


  const isNewHouse = ref(false);

  const currentUserInfo = useDocument(
    computed(() =>
      auth.currentAuthUser ? doc(db, "user", auth.currentAuthUser.uid) : null
    )
  );

  function toggleMode(createNewHouse) {
    isNewHouse.value = createNewHouse;
  }

  //
  const createUserNewHouse = async ({ houseName, userName }) => {
    try {
      await runTransaction(db, async (transaction) => {
        const time = serverTimestamp();
        const houseRef = doc(collection(db, 'house'));
        const userRef = doc(db, 'user', auth.currentAuthUser.uid);
        const inviteCode = generateInviteCode();

        transaction.set(houseRef, {
          name: houseName,
          invite_code: inviteCode,
          created_by: userRef.id,
          created_at: time
        });

        transaction.set(userRef, {
          name: userName,
          email: auth.currentAuthUser.email,
          house_id: houseRef.id,
          created_at: time
        });

        console.log('Usuario y casa creados');
        router.push({ name: 'home' })
      });
    } catch (error) {
      console.error('Error creando usuario y casa:', error);
    }
  };

  const createUserExistingHouse = async ({ inviteCode, userName }) => {

    const q = query(collection(db, "house"), where("invite_code", "==", inviteCode));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.docs[0]) {
      errorMsg.value = 'Ese código no existe'
      console.log('No existo')
    }
    else {
      const house_id = querySnapshot.docs[0].id
      setDoc(doc(db, 'user', auth.currentAuthUser.uid), {
        created_at: serverTimestamp(),
        name: userName,
        email: auth.currentAuthUser.email,
        house_id
      })

      router.push({ name: 'home' })
    }
  }

  return {
    createUserNewHouse,
    createUserExistingHouse,
    toggleMode,
    errorMsg,
    isNewHouse,
    currentUserInfo,
  }
})
