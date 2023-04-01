import { defineStore } from "pinia";


export const usePasswordStore = defineStore("passwordStore", () => {
    //password state and methods
    const password = ref("")
    const maxLength = ref(20)
    const currentLength = ref(0)
    //strength of password state and methods
    const str = ref(0)
    return{
        password,
        maxLength,
        currentLength,
        str
    }
})