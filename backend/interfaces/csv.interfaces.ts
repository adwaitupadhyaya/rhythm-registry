export interface CsvRow {
  name: string;
  dob: string;
  gender: "male" | "female" | "other";
  address: string;
  first_release_year: string;
  no_of_albums_released: string;
}
