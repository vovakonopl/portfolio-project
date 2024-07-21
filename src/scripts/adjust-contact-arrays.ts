import { UserWithContacts } from '@/types/user';

export function adjustContactArrays(data: Partial<UserWithContacts>): void {
  // remain only unique data
  const phoneNumbersSet: Set<string> = new Set(data.phoneNumbers);
  if (data.phoneNumbers) {
    const phoneNumbers: Array<string> = Array.from(phoneNumbersSet);
    data.phoneNumbers = phoneNumbers.slice(0, 3); // max 3 items
  }

  if (data.additionalContacts) {
    data.additionalContacts = data.additionalContacts.slice(0, 6); // max 6 items
  }
}
