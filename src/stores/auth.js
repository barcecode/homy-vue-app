import { defineStore } from "pinia";
import { useCurrentUser, useFirebaseAuth } from 'vuefire';
import { createUserWithEmailAndPassword,  signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore('auth', () => {
  const auth = useFirebaseAuth()
  const currentAuthUser = useCurrentUser()
  const router = useRouter()

  /*onAuthStateChanged(auth, (user) => {
    currentAuthUser.value = user
  })*/

  const errorMsg = ref(false)

  function toggleError() {
    errorMsg.value = !errorMsg.value
    console.log(errorMsg.value)
  }

  const loginUser = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log(currentAuthUser)
        errorMsg.value = false
        router.push({ name: 'home' })
      })
      .catch((error) => {
        console.log(error)
        errorMsg.value = true
      })
  }

  const registerAuthUser = ({ email, password }) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        errorMsg.value = false
        console.log(currentAuthUser.value)
        router.push({ name: 'registerSecond' })
      })
      .catch((error) => {
        errorMsg.value = true
        console.log(error)
      })
  }

  const logOut = async () => {
    await signOut(auth)
    console.log(currentAuthUser)
    router.push({ name: 'initial' })
  }

  const hasError = computed(() => {
    return errorMsg.value
  })

  return {
    currentAuthUser,
    loginUser,
    logOut,
    registerAuthUser,
    toggleError,
    hasError
  }
})
