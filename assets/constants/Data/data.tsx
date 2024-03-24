export const offersData = [
  {
    title: 'Trip to Chicago',
    offerNumber: 5,
    raiseNumber: 1400,
    fullNumber: 2500,
    status: 'Pending',  // <-- Add this status property to each item
    users: [
      {
        firstNameLetter: 'Z',
        lastNameLetter: 'V',
        userName: 'Easy 359',
        amount: 1500,
        interest: 13,
      },
      {
        firstNameLetter: 'J',
        lastNameLetter: 'K',
        userName: 'User 456',
        amount: 2500,
        interest: 10,
      },
      {
        firstNameLetter: 'J',
        lastNameLetter: 'S',
        userName: 'User 456',
        amount: 20,
        interest: 10,
      }, 
    ],
  },
  // ... add more offer objects as needed and ensure each object has a 'status' property
];
