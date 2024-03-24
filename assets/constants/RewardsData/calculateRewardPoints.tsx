export const calculateRewardPoints = (amount: number): number => {
    let points = 0;

    if (amount <= 50) {
      points += Math.floor(amount / 5) * 15;
    } else if (amount <= 100) {
      points += (50 / 5) * 15; 
      points += Math.floor((amount - 50) / 5) * 20;
    } else if (amount <= 250) {
      points += (50 / 5) * 15 + (50 / 5) * 20; 
      points += Math.floor((amount - 100) / 10) * 25;
    } else if (amount <= 500) {
      points += (50 / 5) * 15 + (50 / 5) * 20 + (150 / 10) * 25; 
      points += Math.floor((amount - 250) / 10) * 35;
    } else if (amount <= 750) {
      points += (50 / 5) * 15 + (50 / 5) * 20 + (150 / 10) * 25 + (250 / 10) * 35;
      points += Math.floor((amount - 500) / 10) * 45;
    } else if (amount <= 1000) {
      points += (50 / 5) * 15 + (50 / 5) * 20 + (150 / 10) * 25 + (250 / 10) * 35 + (250 / 10) * 45;
      points += Math.floor((amount - 750) / 10) * 55;
    } else if (amount <= 2500) {
      points += (50 / 5) * 15 + (50 / 5) * 20 + (150 / 10) * 25 + (250 / 10) * 35 + (250 / 10) * 45 + (250 / 10) * 55;
      points += Math.floor((amount - 1000) / 20) * 65;
    } else if (amount <= 5000) {
      points += (50 / 5) * 15 + (50 / 5) * 20 + (150 / 10) * 25 + (250 / 10) * 35 + (250 / 10) * 45 + (250 / 10) * 55 + (1500 / 20) * 65;
      points += Math.floor((amount - 2500) / 25) * 75;
    } else if (amount <= 10000) {
      points += (50 / 5) * 15 + (50 / 5) * 20 + (150 / 10) * 25 + (250 / 10) * 35 + (250 / 10) * 45 + (250 / 10) * 55 + (1500 / 20) * 65 + (2500 / 25) * 75;
      points += Math.floor((amount - 5000) / 50) * 85;
    }

    return points;
};
