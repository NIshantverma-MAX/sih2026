import { HUIDVerification } from '../types';

export const huidRecords: HUIDVerification[] = [
  {
    huid: 'A1B2C3',
    verified: true,
    product: 'Gold Bangle',
    purity: '22K916',
    jeweller: 'Kalyan Jewellers',
    assayingCentre: 'Mumbai Assaying Lab',
    date: '2023-11-20'
  },
  {
    huid: 'X9Y8Z7',
    verified: true,
    product: 'Gold Ring',
    purity: '18K750',
    jeweller: 'Tanishq',
    assayingCentre: 'Delhi Hallmark Centre',
    date: '2023-10-15'
  },
  {
    huid: 'FAKE12',
    verified: false
  },
  {
    huid: 'P4Q5R6',
    verified: true,
    product: 'Gold Necklace',
    purity: '22K916',
    jeweller: 'Malabar Gold',
    assayingCentre: 'Chennai Hallmark Lab',
    date: '2023-11-25'
  },
  {
    huid: 'INVALID',
    verified: false
  }
];

export const hallmarkingServices = {
  description: 'Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in precious metal articles. Hallmarking scheme is mandatory for Gold jewelry in 288 districts.',
  components: [
    'BIS Logo',
    'Purity Grade (e.g. 22K916)',
    '6-digit HUID code'
  ],
  metals: ['Gold', 'Silver']
};
