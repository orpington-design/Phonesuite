import { redirect } from 'next/navigation';

export default function PortalRedirect() {
  // Direct redirect to default tenant shop portal or customer selector
  redirect('/premiumphonex/portal');
}
