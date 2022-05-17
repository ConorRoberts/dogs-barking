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
  programs?: [
    {
      hasMajor?: boolean;
      hasMinor?: boolean;
      short: string;
      name: string;
      id: string;
    }
  ];
}

export default School;
