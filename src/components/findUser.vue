<template>
  <errorPopUp v-if="error" :errorMessage="error" />
  <form action="" id="findUser" v-if="!userData" @submit.prevent="submit">
    <!-- <p>ПІБ</p>
    <input type="text" id="name" autocomplete="off" v-model="form.name"> -->
    <p>Позивний</p>
    <input type="text" id="callsign" required="true" autocomplete="off" v-model="form.callsign">
    <button type="submit" :disabled="loading">Знайти</button>
    <router-link to="/">Назад</router-link>
  </form>
  <div v-if="userData && !loading">
    <template v-if="!showFullInfo">
      <p class="user_name">{{ userData.name.toUpperCase() }}</p>
      <p class="user_callsign">{{ userData.callsign.toUpperCase() }}</p>
      <p class="is_wanted" v-if="shortData.is_wanted"> У РОЗШУКУ </p>
      <p v-if="shortData.is_wanted">Причина розшуку: {{ shortData.wanted_reason }}</p>
      <p :class="{ 'green': userData.license_weapon, 'red': !userData.license_weapon }">Ліцензія на зброю {{
        userData.license_weapon ?
          userData.license_weapon + ' рівня' : '' }}</p>
      <p :class="{ 'green': userData.license_fishing, 'red': !userData.license_fishing }">Ліцензія на риболовлю</p>
      <p :class="{ 'green': userData.lisence_huntering, 'red': !userData.lisence_huntering }">Ліцензія на полювання</p>
      <p :class="{ 'green': userData.license_artefact, 'red': !userData.license_artefact }">Ліцензія на артефакти</p>
      <p v-if="licenseDate">Ліцензія на перебування дійсна до {{ shortData.license_stay }}</p>
      <button @click="showFullInfo = true">Показати повну інформацію</button>
    </template>
    <form action="" id="addUser" v-if="showFullInfo" @submit.prevent="sendChangedUserData">
      <p class="user_name">{{ userData.name.toUpperCase() }}</p>
      <p class="user_callsign">{{ userData.callsign.toUpperCase() }}</p>
      <p>Фракція</p>
      <input type="text" id="fractions" list="fractions_list" autocomplete="off" v-model="userData.fractions">
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
      <p>Дата народження - {{ userData.birth_date }}</p>
      <p>Дата прибуття в ЧЗО - {{ userData.arrive_date }}</p>
      <p>Місто</p>
      <input type="text" id="city" v-model="userData.city">
      <p>Ліцензія на зброю</p>
      <select name="license_weapon" id="license_weapon" v-model="userData.license_weapon">
        <option value="0">Немає</option>
        <option value="1">1 рівень</option>
        <option value="2">2 рівень</option>
        <option value="3">3 рівень</option>
      </select>
      <p>Ліцензія на перебування</p>
      <select name="license_stay" id="license_stay" v-model="userData.license_stay">
        <option value="null">Немає</option>
        <option value="3">3 дні</option>
        <option value="7">7 днів </option>
        <option value="30">30 днів</option>
      </select>
      <div class="lisenses">
        <span>
          <p :class="{ 'green': userData.license_fishing, 'red': !userData.license_fishing }">Ліцензія <br> на риболовлю
          </p>
          <input type="checkbox" id="license_fishing" autocomplete="off" v-model="userData.license_fishing">
        </span>
        <span>
          <p :class="{ 'green': userData.lisence_huntering, 'red': !userData.lisence_huntering }">Ліцензія <br> на
            полювання</p>
          <input type="checkbox" id="lisence_huntering" autocomplete="off" v-model="userData.lisence_huntering">
        </span>
        <span>
          <p :class="{ 'green': userData.license_artefact, 'red': !userData.license_artefact }">Ліцензія <br> на
            артефакти
          </p>
          <input type="checkbox" id="license_artefact" autocomplete="off" v-model="userData.license_artefact">
        </span>
      </div>
      <p>Розшук</p>
      <select name="is_wanted" id="is_wanted" v-model="userData.is_wanted">
        <option value="false">Ні</option>
        <option value="true">Так</option>
      </select>
      <p>Причина розшуку</p>
      <input type="text" id="wanted_reason" autocomplete="off" v-model="userData.wanted_reason.handle_reason">
      <p>Додатк. примітки</p>
      <textarea type="text" id="desc" cols="20" rows="5" v-model="userData.desc.text"></textarea>
      <button type="submit" :disabled="loading">Відправити</button>
    </form>
    <button @click="goBack">Назад до пошуку</button>
  </div>



</template>

<script setup>
import errorPopUp from './errorPopUp.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers';
const router = useRouter()
const { userData, getUser, loading, changeUserData } = useUsers();
const showFullInfo = ref(false);
const error = ref(null);
const licenseDate = ref(false);

const form = ref({
  name: '',
  callsign: '',
});

const shortData = ref(
  {
    is_wanted: false,
    wanted_reason: null,
    desc: null,
    license_stay: null
  }
)
const submit = async () => {
  loading.value = true;
  try {
    await getUser(form.value);
  } catch (err) {
    error.value = err.message;
    setTimeout(() => {
      error.value = null;
    }, 2000);
  }
  userDataHandler(userData.value)

};

const userDataHandler = (userData) => {
  if (userData.is_wanted) {
    shortData.value.is_wanted = true;
    shortData.value.wanted_reason = userData.wanted_reason.handle_reason ? userData.wanted_reason.handle_reason : 'Причина не вказана'
  }

  if (userData.license_stay === null) {
    shortData.value.is_wanted = true;
    shortData.value.wanted_reason = userData.wanted_reason.handle_reason ? userData.wanted_reason.handle_reason + " Немає ліцензії на перебування" : "Немає ліцензії на перебування"
    shortData.value.license_stay = "Немає ліцензії на перебування"
  } else if (isDatePassedKyiv(userData.license_stay.end_date)) {
    shortData.value.is_wanted = true;
    shortData.value.wanted_reason = userData.wanted_reason.handle_reason ? userData.wanted_reason.handle_reason + " Протермінована ліцензія на перебування" : "Протермінована ліцензія на перебування"
    shortData.value.license_stay = userData.license_stay.end_date
    licenseDate.value = true
  } else {
    shortData.value.license_stay = userData.license_stay.end_date
    licenseDate.value = true
  }
  shortData.value.desc = userData.desc.text;

};

const goBack = () => {
  userData.value = null;
  showFullInfo.value = false;
  shortData.value = {
    is_wanted: false,
    wanted_reason: null,
    desc: null,
    license_stay: null
  }
  form.value.name = '';
  form.value.callsign = '';
  licenseDate.value = false;
};

const isDatePassedKyiv = (dateString) => {
  if (!dateString) return false
  const kyivNow = new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'Europe/Kyiv'
    })
  )
  kyivNow.setHours(0, 0, 0, 0)
  const [year, month, day] = dateString.split('-').map(Number)
  const inputDate = new Date(year, month - 1, day)

  return inputDate < kyivNow
}
const sendChangedUserData = async () => {
  try {
    console.log(userData.value)

    if (userData.value.license_stay === null) {
      console.log(userData.value, 'null')
      userData.value.license_stay = null
    } else if (typeof userData.value.license_stay !== 'object') {
      console.log(userData.value, 'else if object')
      const licenseStay = parseInt(userData.value.license_stay)
      userData.value.license_stay = getLicenseDates(licenseStay)
    }

    const createdUser = await changeUserData(userData.value.id, userData.value)
    if (createdUser) {
      router.back()
    }

  } catch (err) {
    error.value = err.message;

    setTimeout(() => {
      error.value = null;
    }, 2000);
  }
}
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
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
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
  margin: 10px 5px;
  padding: 5px;
}

button {

  text-decoration: none;
  margin: 15px 0;
  font-size: 20px;
  border: 5px solid;
  border-radius: 12px;
  background-color: transparent;
  padding: 15px;
  border-color: rgb(3, 51, 51);
  cursor: pointer;
  color: aliceblue;
  text-align: center;
  width: 100%;
}

a {
  text-decoration: none;
  font-size: 20px;
  margin: 15px 0;
  border: 5px solid;
  border-radius: 12px;
  background-color: transparent;
  padding: 15px;
  border-color: rgb(3, 51, 51);
  cursor: pointer;
  color: aliceblue;
  text-align: center;
  display: block;
}

.green {
  color: rgb(0, 133, 44);
}

.red {
  color: rgb(255, 0, 0);
}

.is_wanted {
  color: rgb(255, 0, 0);
  font-weight: bold;
  font-size: 1.2rem;
}

.lisenses {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  text-align: center;
  margin: 15px 0;
}

.lisenses p {
  font-size: 1rem;
}

.lisenses input {
  width: auto;
}
</style>
