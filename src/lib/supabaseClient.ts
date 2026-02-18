import { createClient } from '@supabase/supabase-js'

let supabaseClient: any = null

export const initSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables de entorno de Supabase no configuradas')
    return null
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    initSupabaseClient()
  }
  return supabaseClient
}

// Auth functions
export const signUp = async (email: string, password: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client.auth.signUp({
    email,
    password
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const client = getSupabaseClient()
  const { error } = await client.auth.signOut()
  return { error }
}

// Workshops functions
export const getWorkshops = async () => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('workshops')
    .select('*')
    .order('date', { ascending: true })
  return { data, error }
}

export const createWorkshop = async (workshop: any) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('workshops')
    .insert([workshop])
  return { data, error }
}

export const updateWorkshop = async (id: string, workshop: any) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('workshops')
    .update(workshop)
    .eq('id', id)
  return { data, error }
}

export const deleteWorkshop = async (id: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('workshops')
    .delete()
    .eq('id', id)
  return { data, error }
}

// Trainings functions
export const getTrainings = async () => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('trainings')
    .select('*')
    .order('date', { ascending: true })
  return { data, error }
}

export const createTraining = async (training: any) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('trainings')
    .insert([training])
  return { data, error }
}

export const deleteTraining = async (id: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('trainings')
    .delete()
    .eq('id', id)
  return { data, error }
}

// Registrations functions
export const registerToWorkshop = async (registration: any) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('registrations')
    .insert([registration])
    .select()
  return { data, error }
}

export const getWorkshopRegistrations = async (workshopId: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('registrations')
    .select('*')
    .eq('workshop_id', workshopId)
  return { data, error }
}

export const getUserRegistrations = async (userId: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('registrations')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

// Form questions functions
export const getFormQuestions = async () => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('form_questions')
    .select('*')
    .order('order', { ascending: true })
  return { data, error }
}

export const updateFormQuestion = async (id: string, question: any) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('form_questions')
    .update(question)
    .eq('id', id)
  return { data, error }
}

export const createFormQuestion = async (question: any) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('form_questions')
    .insert([question])
  return { data, error }
}
// User Profile functions
export const createUserProfile = async (userId: string, email: string, role: string = 'socio') => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('user_profiles')
    .insert([{ id: userId, email, role }])
    .select()
    .single()
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateUserProfile = async (userId: string, profile: any) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('user_profiles')
    .update(profile)
    .eq('id', userId)
  return { data, error }
}

export const getAllUserProfiles = async () => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const updateUserRole = async (userId: string, newRole: string) => {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('user_profiles')
    .update({ role: newRole })
    .eq('id', userId)
  return { data, error }
}