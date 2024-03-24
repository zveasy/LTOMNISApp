import { OfferStatus } from "../Components/CustomPaymentBlock";

export const dummyUserData = {
  firstname: 'John',
  lastname: 'Doe',
  status: 'Paid' as OfferStatus, // Update the status property to match OfferStatus
  payments: [
    { leftText: 'Payment 1', rightText: '$100' },
    { leftText: 'Payment 2', rightText: '$200' },
    // Add more payment objects as needed
  ],
};

export const dummyUserData2 = {
  firstname: 'Jane',
  lastname: 'Doe',
  status: 'Not paid' as OfferStatus, // Update the status property to match OfferStatus
  payments: [
    { leftText: 'Payment 1', rightText: '$50' },
    { leftText: 'Payment 2', rightText: '$75' },
    // Add more payment objects as needed
  ],
};
