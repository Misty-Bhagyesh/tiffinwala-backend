const express = require('express');
const router = express.Router();

const PLANS = [
  { id: 'today',    label: 'Today Only',    sub: 'Single delivery today',   emoji: '📅', needsDates: false, codAllowed: true },
  { id: 'tomorrow', label: 'Tomorrow',      sub: 'Scheduled for tomorrow',  emoji: '📆', needsDates: false, codAllowed: true },
  { id: 'weekly',   label: 'Weekly Plan',   sub: '7 days · Best value',     emoji: '📋', needsDates: true,  codAllowed: false },
  { id: 'monthly',  label: 'Monthly Plan',  sub: '30 days · Save more',     emoji: '📦', needsDates: true,  codAllowed: false },
];

router.get('/', (req, res) => res.json({ plans: PLANS }));

module.exports = router;
