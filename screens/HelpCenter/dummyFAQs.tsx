interface FAQItem {
  section: string;
  title: string;
  content: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    section: 'Getting Started',
    title: 'What is OMNIS?',
    content:
      'OMNIS is a peer-to-peer lending platform designed to serve immigrants, unbanked, and underbanked communities. It enables community-based, trust-oriented financial transactions through lending circles and direct peer lending.',
  },
  {
    section: 'Getting Started',
    title: 'How do I create an account?',
    content:
      'Tap "Register" on the sign-in screen, enter your email and a strong password (8+ characters with a number and special character), then verify your identity through our verification flow.',
  },
  {
    section: 'Getting Started',
    title: 'How does the verification process work?',
    content:
      'After registration you will be asked to verify your identity with a selfie and a valid ID document. Verification typically completes within 24 hours.',
  },

  // Lending
  {
    section: 'Lending',
    title: 'How do I lend money on OMNIS?',
    content:
      'Browse the marketplace for borrower posts, review their trust score and loan details, then submit an offer specifying the amount and interest rate you are willing to lend at.',
  },
  {
    section: 'Lending',
    title: 'What happens if a borrower misses a payment?',
    content:
      'You will receive a notification when a payment is late. OMNIS provides dispute resolution tools and the late payment will affect the borrower\'s trust score.',
  },

  // Borrowing
  {
    section: 'Borrowing',
    title: 'How do I request a loan?',
    content:
      'Create a new post from your feed specifying the amount you need, the purpose, and your preferred repayment terms. Lenders in the community can then make offers on your post.',
  },
  {
    section: 'Borrowing',
    title: 'What are the borrowing limits?',
    content:
      'Borrowing limits are determined by your trust score, verification level, and repayment history. As you build a positive track record, your limits increase.',
  },

  // Payments
  {
    section: 'Payments',
    title: 'How do I make a payment?',
    content:
      'Go to your active offers, select the loan, and tap "Make Payment". You can pay via your linked bank account. Payments are tracked in your transaction journal.',
  },
  {
    section: 'Payments',
    title: 'Can I make early payments?',
    content:
      'Yes, you can make early or extra payments at any time without penalty. Early payments positively impact your trust score.',
  },

  // Trust Score
  {
    section: 'Trust Score',
    title: 'What is the Trust Score?',
    content:
      'The Trust Score is a community-driven rating that reflects your reliability as a borrower or lender. It is calculated based on payment history, endorsements, verification level, and community participation.',
  },
  {
    section: 'Trust Score',
    title: 'How can I improve my Trust Score?',
    content:
      'Make payments on time, get endorsements from other users, complete identity verification, and actively participate in lending circles and groups.',
  },

  // Account
  {
    section: 'Account',
    title: 'How do I reset my password?',
    content:
      'Tap "Forgot Password?" on the sign-in screen and enter your registered email. You will receive a link to create a new password.',
  },
  {
    section: 'Account',
    title: 'How do I link my bank account?',
    content:
      'Go to Settings > Bank Accounts and follow the secure Plaid integration flow to connect your bank. Your credentials are never stored on our servers.',
  },
  {
    section: 'Account',
    title: 'How do I delete my account?',
    content:
      'Contact support at support@omnisapp.com. You must settle all outstanding loans before account deletion. This action is irreversible.',
  },
];

export default faqData;
