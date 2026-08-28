import { HUIDVerification } from '../types';
import { huidRecords, hallmarkingServices } from '../data/hallmarking';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function verifyHUID(huid: string): Promise<HUIDVerification> {
  await delay(1500);
  
  const record = huidRecords.find(r => r.huid === huid);
  
  if (record) {
    return record;
  }
  
  if (huid.length === 6) {
    return {
      huid,
      isValid: false,
      message: 'Invalid HUID. No record found.'
    } as unknown as HUIDVerification;
  }
  
  throw new Error('HUID must be 6 alphanumeric characters');
}

export async function getHallmarkingInfo(): Promise<any> {
  await delay(600);
  return hallmarkingServices;
}
