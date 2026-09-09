import { redirect } from 'next/navigation';

export default function StaffRedirect() {
  // Direct redirect to default tenant staff operations portal
  redirect('/premiumphonex/staff');
}
