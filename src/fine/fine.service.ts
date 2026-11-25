import { BadRequestException, Injectable } from '@nestjs/common';

const RATES: Record<string, number> = {
  general: 5,
  reserve: 20,
  reference: 50,
};

const GRACE_DAYS = 3;
const MAX_FINE = 500;

@Injectable()
export class FineService {
  convert(daysRaw?: unknown, typeRaw?: unknown) {
    // ตรวจ days: ต้องเป็นจำนวนเต็ม >= 0
    
    if (typeof daysRaw !== 'string' || daysRaw.trim() === '') {
      throw new BadRequestException('กรุณาใส่จำนวนวัน');
    }
    const days = Number(daysRaw);
    if (!Number.isInteger(days) || days < 0) {
      throw new BadRequestException('วันน้อยกว่า0และต้องเป็นจำนวนเต็มเท่านั้น');
    }

    // ตรวจ type
    const type = typeof typeRaw === 'string' ? typeRaw.trim().toLowerCase() : '';
    if (!Object.hasOwn(RATES, type)) {
      throw new BadRequestException('type ต้องเป็น general, reserve หรือ reference เท่านั้น');
    }

    // คำนวณ
    const chargeableDays = Math.max(0, days - GRACE_DAYS);
    const rate = RATES[type];
    const total = Math.min(chargeableDays * rate, MAX_FINE);

    return { days, type, chargeableDays, rate, total };
  }
}