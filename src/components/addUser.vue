<template>
  <errorPopUp v-if="errorData" :errorMessage="errorData" />
  <addUserPopup v-if="addUserPopupData" :addUserData="addUserPopupData" />
  <form action="" id="addUser" @submit.prevent="checkUserdata">
    <p>ПІБ</p>
    <input type="text" id="name" autocomplete="off" v-model="userDataForm.name">
    <p>Позивний</p>
    <input type="text" id="callsign" required="true" autocomplete="off" v-model="userDataForm.callsign">
    <p>Фракція</p>
    <input type="text" id="fractions" list="fractions_list" autocomplete="off" v-model="userDataForm.fractions">
    <datalist id="fractions_list">
      <option value="Долг">Долг</option>
      <option value="Воля">Воля</option>
      <option value="Найманці">Найманці</option>
      <option value="Моноліт">Моноліт</option>
      <option value="Бандіти">Бандіти</option>
      <option value="Вільні сталкери">Вільні сталкери</option>
      <option value="Нейтрали">Нейтрали</option>
      <option value="Охорона села">Охорона села</option>
      <option value="Чисте небо">Чисте небо</option>
      <option value="Ренегати">Ренегати</option>
      <option value="Вчені">Вчені</option>
      <option value="Дігери">Дігери</option>
    </datalist>
    <p>Дата народження</p>
    <input type="date" id="birth_date" autocomplete="off" v-model="userDataForm.birth_date">
    <p>Дата прибуття в ЧЗО</p>
    <input type="date" id="arrive_date" autocomplete="off" v-model="userDataForm.arrive_date">
    <p>Місто</p>
    <input type="text" id="city" v-model="userDataForm.city">
    <p>Ліцензія на зброю</p>
    <select name="license_weapon" id="license_weapon" v-model="userDataForm.license_weapon">
      <option value="0">Немає</option>
      <option value="1">1 рівень</option>
      <option value="2">2 рівень</option>
      <option value="3">3 рівень</option>
    </select>
    <p>Ліцензія на перебування</p>
    <select name="license_stay" id="license_stay" v-model="userDataForm.license_stay">
      <option value="null">Немає</option>
      <option value="3">3 дні</option>
      <option value="7">7 днів </option>
      <option value="30">30 днів</option>
    </select>
    <div class="lisenses">
      <span>
        <p :class="{ 'green': userDataForm.license_fishing }">Ліцензія <br> на риболовлю</p>
        <input type="checkbox" id="license_fishing" autocomplete="off" v-model="userDataForm.license_fishing">
      </span>
      <span>
        <p :class="{ 'green': userDataForm.lisence_huntering }">Ліцензія <br> на полювання</p>
        <input type="checkbox" id="lisence_huntering" autocomplete="off" v-model="userDataForm.lisence_huntering">
      </span>
      <span>
        <p :class="{ 'green': userDataForm.license_artefact }">Ліцензія <br> на артефакти</p>
        <input type="checkbox" id="license_artefact" autocomplete="off" v-model="userDataForm.license_artefact">
      </span>
    </div>
    <p>Розшук</p>
    <select name="is_wanted" id="is_wanted" v-model="userDataForm.is_wanted">
      <option value="false">Ні</option>
      <option value="true">Так</option>
    </select>
    <p>Причина розшуку</p>
    <input type="text" id="wanted_reason" autocomplete="off" v-model="userDataForm.wanted_reason.handle_reason">
    <p>Додатк. примітки</p>
    <textarea type="text" id="desc" cols="20" rows="5" v-model="userDataForm.desc.text"></textarea>
    <button type="submit" :disabled="loading">Відправити</button>
    <router-link to="/">Назад</router-link>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers';
import errorPopUp from './errorPopUp.vue';
import addUserPopup from './addUserPopup.vue';
const { createUser, loading } = useUsers();
const router = useRouter()
const errorData = ref(null);
const addUserPopupData = ref(null);

function getLicenseDates(dayDate) {
  const timezone = 'Europe/Kyiv'
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(now)
  const getPart = (type) => parts.find((p) => p.type === type).value
  const year = getPart('year')
  const month = getPart('month')
  const day = getPart('day')
  const startDate = `${year}-${month}-${day}`
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + Number(dayDate))
  const endParts = formatter.formatToParts(end)
  const endYear = endParts.find((p) => p.type === 'year').value
  const endMonth = endParts.find((p) => p.type === 'month').value
  const endDay = endParts.find((p) => p.type === 'day').value
  const endDate = `${endYear}-${endMonth}-${endDay}`
  return {
    start_date: startDate,
    end_date: endDate,
  }
}


const userDataForm = ref({
  name: null,
  callsign: null,
  fractions: null,
  birth_date: null,
  arrive_date: null,
  city: null,
  license_weapon: 0,
  license_stay: null,
  license_fishing: false,
  lisence_huntering: false,
  license_artefact: false,
  is_wanted: false,
  wanted_reason: {
    "handle_reason": "",
    "auto_reason": "",
  },
  desc: {
    "text": "",
  },
  added_by: localStorage.getItem('userCallsign'),
});

const checkUserdata = async () => {
  loading.value = true
  try {
    if (userDataForm.value.license_stay === null) {
      userDataForm.value.license_stay = null
    } else {
      const licenseStay = parseInt(userDataForm.value.license_stay)
      userDataForm.value.license_stay = getLicenseDates(licenseStay)
    }
    if (userDataForm.value.name) {
      userDataForm.value.name =
        userDataForm.value.name.toLowerCase().trim()
    } else {
      throw new Error('ПІБ не може бути пустим')
    }
    if (userDataForm.value.callsign) {
      userDataForm.value.callsign =
        userDataForm.value.callsign.toLowerCase().trim()
    } else {
      throw new Error('Позивний не може быть пустым')
    }

    const createdUser = await createUser(userDataForm.value)
    if (createdUser) {
      addUserPopupData.value = createdUser.callsign
      setTimeout(() => {
        addUserPopupData.value = null;
        router.back()
      }, 2000);

    } else {
      throw new Error('Користувач з таким позивним вже існує')
    }

  } catch (err) {
    errorData.value = err.message;
    setTimeout(() => {
      errorData.value = null;
    }, 2000);
  }
}

</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

input,
textarea,
select {
  margin: 10px 5px;
  border-radius: 5px;
  padding: 5px;

}

p {
  text-align: center;
  font-size: 1rem;
}

button,
a {
  text-decoration: none;
  margin: 10px 5px;
  font-size: 20px;
  margin: 15px;
  border: 5px solid;
  border-radius: 12px;
  background-color: transparent;
  padding: 15px;
  border-color: rgb(3, 51, 51);
  cursor: pointer;
  color: aliceblue;
  text-align: center;
}

.lisenses {
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: space-between;
  margin: 15px 0;
}

.lisenses p {
  font-size: 1rem;
}

.green {
  color: rgb(0, 133, 44);
}
</style>
