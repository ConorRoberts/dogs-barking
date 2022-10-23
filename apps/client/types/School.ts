interface School {
  country: string;
  address: string;
  province: string;
  phone: string;
  city: string;
  postalCode: string;
  name: string;
  short: string;
  id: string;
  type: string;
  url: string;
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
