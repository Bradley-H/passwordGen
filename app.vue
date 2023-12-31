<template>
  <main class="flex">
      <a-typography-title style="color: lightgray" :level="level">Password
      Generator</a-typography-title>
    <!-- input for password -->
    <section class="title flex">
      <a-input :max-length="store.maxLength" disabled size="large" v-model:value="store.password" fluid
      style="color: black" />
      <svg @click="openNotification" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000"
        enable-background="new 0 0 1000 1000" xml:space="preserve">
        <g>
          <path
            d="M796,10H384.2c-59.8,0-108.5,48.7-108.5,108.5v13.3H204c-59.8,0-108.5,48.7-108.5,108.5v641.3C95.6,941.3,144.2,990,204,990h411.7c59.8,0,108.5-48.7,108.5-108.5v-13.3H796c59.8,0,108.5-48.7,108.5-108.5V118.5C904.4,58.7,855.8,10,796,10z M654.3,881.5c0,21.2-17.3,38.5-38.5,38.5H204c-21.2,0-38.5-17.3-38.5-38.5V240.2c0-21.2,17.3-38.5,38.5-38.5h411.7c21.2,0,38.5,17.3,38.5,38.5L654.3,881.5L654.3,881.5z M834.5,759.8c0,21.2-17.3,38.5-38.5,38.5h-71.7v-558c0-59.8-48.7-108.5-108.5-108.5h-270v-13.3c0-21.2,17.3-38.5,38.5-38.5H796c21.2,0,38.5,17.3,38.5,38.5V759.8z" />
        </g>
      </svg>
    </section>

    <!-- options -->
    <section>
      <div class="heading flex">
        <a-typography-title style="color: lightgray" :level="level">Character Length</a-typography-title>
        <h2>{{ store.currentLength }}</h2>
      </div>
      <a-slider v-model:value="store.currentLength" :min="5" :max="store.maxLength" :tooltipVisible="false" />
      <div v-for="opt in options" :key="opt.id">
        <a-checkbox @click="passwordGenerator.CheckBox(opt.id)">{{ opt.name }}</a-checkbox>
      </div>

      <div class="str flex">
          <h3>Strength: </h3>
        <a-progress :percent="store.str" :stroke-color="{
          '0%': '#FF0000',
          '100%': '#00FF00',
        }" />
      </div>
    </section>
    <section>
      <a-button
        @click="passwordGenerator.generatePassword(getRandomUpper, getRandomLower, getRandomNumber, getRandomSymbol)"
        type="primary" size="large" block>Generate Password</a-button>
    </section>
    
  </main>
</template>




<script lang="ts" setup>
import { notification } from 'ant-design-vue';
import { CloseOutlined, SmileOutlined } from '@ant-design/icons-vue';
import { usePasswordStore } from '@/store/passwordStore'

//store//
const store = usePasswordStore()


//typography title level
const level = ref(2);
const options = ref([
  { id: 0, name: 'Include Uppercase', checked: false },
  { id: 1, name: 'Include Lowercase', checked: false },
  { id: 2, name: 'Include Numbers', checked: false },
  { id: 3, name: 'Include Symbols', checked: false }
])


//this function will copy the password to the clipboard and display a notification
const openNotification = () => {
  if (store.password === '') {
    return
  }
  notification.open({
    message: '',
    description:
      'Your password has been copied to your clipboard.',
    icon: () => h(SmileOutlined, { style: 'color:  #108ee9; transform: translate(-20px, 3px); paddingLeft: 10px' }),
    duration: 2.25,
    style: {
      marginRight: 100,
      backgroundColor: '#242320',
      color: "#fff"
    },
    closeIcon: () => h(''),
  });
  navigator.clipboard.writeText(store.password)
}
// this function will calculate the strength of the password
const passwordEnthorpy = () => {
  const charsetSize = 95; // Number of possible characters in the password
  const entropy = Math.log2(Math.pow(charsetSize, store.password.length))
  store.str = entropy
  //rounding to 2 decimal places
  store.str = Math.round(store.str * 100) / 100
}

// this function is the framework for the getrandomLower, upper .etc, to reduce markup
const getRandomFunc = (min: any, max: any) => {
  return String.fromCharCode(Math.floor(Math.random() * min) + max);
};


// this uses the getrandomFunc to get a random character from the ascii table
const getRandomLower = () => getRandomFunc(26, 65);
const getRandomUpper = () => getRandomFunc(26, 97);
const getRandomNumber = () => getRandomFunc(10, 48);
const getRandomSymbol = () => {
  const symbols = "!@#$%^&*(){}[]/,.";
  return String(symbols[Math.floor(Math.random() * symbols.length)]);
};



//this'll call the functions based on the checkbox values
const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

let passwordGenerator = {
  // this'll remove and add a checked value to the checkbox
  CheckBox(index: string) {
    options.value.forEach((box: any) => {
      if (box.id === index) {
        box.checked = !box.checked;
      }
    });
  },


  // this'll generate a password based on the checkbox values, and run the functions or not
  generatePassword(
    upper: string,
    lower: string,
    number: string,
    symbol: string){
//reset the password
store.password = ''
    // filter out unchecked types
    let typesCount = options.value.filter((box: any) => box.checked).length;
    let typesArr = options.value.filter((box: any) => box.checked).map((box: any) => box.id);


    // don't run if nothing is checked or if the length is 0
    if (typesCount < 1 || store.currentLength === 0) {
      notification.open({
        message: '',
        description:
          'Please select at least one option.',
        icon: () => h(CloseOutlined, { style: 'color:  #ffff; transform: translate(-20px, -3px); paddingLeft: 10px' }),
        duration: 2.3,
        style: {
          marginRight: 100,
          backgroundColor: '#242320',
          color: "#fff"
        },
        closeIcon: () => h(''),
      });
      store.str = 0
      return "";
    }
    // loop over the length, call the function for each type that is checked and add the value to the password string
    for (let i = 0; i <= store.currentLength - 1; i += typesCount) {
      typesArr.forEach(type => {
        const funcName = Object.keys(randomFunc)[type];
        store.password += randomFunc[funcName]();
      });
      store.password = store.password.slice(0, store.currentLength);
    }
    passwordEnthorpy()
  }
}



</script>

<style>
.flex,
label span {
  display: flex;
}

input::placeholder {
  color: #177ddc;
}

main {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  background-color: #2f2f2f;
  padding: 3rem 1.15rem;
  gap: 10px;
}

.heading {
  align-items: center;
  gap: 1rem;
}

.str {
  margin-top: 1rem;
  gap: 1rem;
}

.str h3 {
  color: white;
}

.str span,
h2 {
  color: #177ddc;
  font-weight: bold;
}

svg {
  width: 2rem;
  height: 2rem;
  margin-left: 1rem;
  fill: white;
  stroke-width: 10px;
  cursor: pointer;
  transition: all .3s ease-in-out;
}

svg:hover {
  fill: #177ddc;
}

h2 {
  font-size: 40px;
}

section {
  background-color: #242320;
  width: clamp(340px, 90%, 970px);
  padding: 1rem 2rem;
}

section.title {
  align-items: center;
}

label span {
  color: #177ddc;
  font-weight: bold;
  margin: .5rem 0;
}

@media screen and (max-width: 768px) {
  .heading h1 {
    font-size: 1.5rem;
  }

  .heading h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 1200px) {
  section{
    width: clamp(800px, 70%, 1000px);
  }
}


@media screen and (max-width: 2000px) {
section{
  width: clamp(900px, 75%, 1200px);
}

.heading h1 {
    font-size: 2rem;
  }

  .heading h2 {
    font-size: 2rem;
  }

  label span{
    font-size: 1.1rem;
    transform: translateY(-1px);
  }
}

</style>