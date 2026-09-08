'use server'

import { createClient } from '../../utils/supabase/server'
import { cookies } from 'next/headers'

export async function registerTenant(formData) {
  const supabase = await createClient()
  
  const businessName = formData.get('businessName')
  const domainSlug = formData.get('domainSlug')
  const email = formData.get('adminEmail')
  const password = formData.get('adminPassword')

  if (!businessName || !domainSlug || !email || !password) {
    return { error: 'All fields are required.' }
  }

  // 1. Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  const userId = authData.user?.id
  if (!userId) {
    return { error: 'User registration failed or requires email confirmation. Please disable Email Confirmations in Supabase settings.' }
  }

  // 2. Insert Tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert([{ name: businessName, slug: domainSlug }])
    .select()
    .single()

  if (tenantError) return { error: `Tenant Error: ${tenantError.message}` }

  // 3. Insert Branch
  const { data: branch, error: branchError } = await supabase
    .from('branches')
    .insert([{ tenant_id: tenant.id, name: 'Main HQ' }])
    .select()
    .single()

  if (branchError) return { error: `Branch Error: ${branchError.message}` }

  // 4. Insert Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{
      id: userId,
      tenant_id: tenant.id,
      branch_id: branch.id,
      role: 'tenant_admin',
      name: 'Store Admin',
      email: email,
      commission_rate: 0
    }])

  if (profileError) return { error: `Profile Error: ${profileError.message}` }

  return { success: true, slug: domainSlug }
}
