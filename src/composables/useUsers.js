import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export function useUsers() {
  const userData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getUser = async ({ name, callsign }) => {
    if (!name && !callsign) {
      throw new Error('Треба вказати ФІО або позивний')
    }

    loading.value = true
    error.value = null

    let query = supabase.from('Users').select('*')

    if (name) query = query.eq('name', name.toLowerCase())
    if (callsign) query = query.eq('callsign', callsign.toLowerCase())

    const { data, error: err } = await query.maybeSingle()

    if (err) {
      console.error('getUser error:', err)
      error.value = err
      userData.value = null
    } else {
      userData.value = data
    }
    if (userData.value === null) {
      throw new Error('Жмиха не знайдено')
    }
    loading.value = false
    return data
  }

  const createUser = async (newUser) => {
    if (!newUser?.name) {
      throw new Error("ФІО обов'язкове поле")
    }
    if (!newUser?.callsign) {
      throw new Error("Позивний обов'язкове поле")
    }
    loading.value = true
    error.value = null
    try {
      const { data: isUserExist, error: checkError } = await supabase
        .from('Users')
        .select('id')
        .eq('callsign', newUser.callsign)
        .maybeSingle()

      if (checkError) {
        throw checkError
      }
      if (isUserExist) {
        throw new Error('Користувач з таким позивним вже існує')
      }
      const { data, error: insertErr } = await supabase
        .from('Users')
        .insert([newUser])
        .select()
        .single()

      if (insertErr) {
        throw insertErr
      }

      userData.value = data
      return data
    } catch (err) {
      console.error('createUser error:', err)
      error.value = err.message || err
      return null
    } finally {
      loading.value = false
    }
  }

  const changeUserData = async (id, newData) => {
    if (!id) {
      throw new Error('Не указан ID пользователя')
    }

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('Users')
      .update(newData)
      .eq('id', id)
      .select()
      .single()

    if (err) {
      console.error('changeUserData error:', err)
      error.value = err
      loading.value = false
      return null
    }

    userData.value = data
    loading.value = false
    return data
  }

  return {
    userData,
    loading,
    error,
    getUser,
    createUser,
    changeUserData,
  }
}
