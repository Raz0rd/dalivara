import { headers } from 'next/headers';
import { getTenantByDomain, getDefaultTenant, type TenantConfig } from '@/config/tenants';

export async function getCurrentTenant(): Promise<TenantConfig> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  const tenant = getTenantByDomain(host);
  return tenant || getDefaultTenant();
}

export function getTenantFromHost(host: string): TenantConfig {
  const tenant = getTenantByDomain(host);
  return tenant || getDefaultTenant();
}
