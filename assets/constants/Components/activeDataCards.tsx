import React from 'react';

export type OfferStatus =
  | 'Closed'
  | 'Pending'
  | 'Accepted'
  | 'Not paid'
  | 'In processing'
  | 'Payed';

export type RowData = {
  leftText: string;
  rightText: string;
};

export type DividerData = {
  isDivider: true;
};

export type DataCard = {
  firstname: string;
  lastname: string;
  status: OfferStatus;
  data: Array<RowData | DividerData>;
};

const activeDataCards: Array<DataCard> = [
  {
    firstname: 'John',
    lastname: 'Doe',
    status: 'Accepted',
    data: [
      {leftText: 'Sent to', rightText: 'Zak Veasy'},
      {leftText: 'Amount offered', rightText: '$15'},
      {leftText: 'Interest rate', rightText: '3%'},
      {leftText: 'Points Collected', rightText: '150'},
    ],
  },
  // ... you can add more data objects here
];

export default activeDataCards;
