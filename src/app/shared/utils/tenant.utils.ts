export function  getAge(born: string | Date): number {
  const birthDate = new Date(born);
  const today = new Date();

  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

  const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
  const dayDiff = today.getUTCDate() - birthDate.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}