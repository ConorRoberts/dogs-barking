interface School {
  name: string;
  short: string;
  url: string;
  type: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  id: string;
  majors?: object[];
  minors?: object[];
}

export default School;
