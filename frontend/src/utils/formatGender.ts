export function formatGender(gender: string | null | undefined): string {
  if (!gender) return "Unknown";
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}
