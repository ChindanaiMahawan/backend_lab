import { BadRequestException, Injectable } from '@nestjs/common';

const ZONE_FEES: Record<string, number> = {
  bangkok: 0,
  north: 10,
  south: 25,
};

@Injectable()
export class ShippingService {
  convert(weightRaw?: unknown, zoneRaw?: unknown) {
    // ตรวจ weight
    if (typeof weightRaw !== 'string' || weightRaw.trim() === '') {
      throw new BadRequestException('กรุณาใส่น้ำหนัก');
    }
    const weight = Number(weightRaw);
    if (!Number.isFinite(weight) || weight <= 0) {
      throw new BadRequestException('น้ำหนักน้อยกว่า 0 และต้องเป็นเลขเท่านั้น');
    }

    // ตรวจ zone
    if (typeof zoneRaw !== 'string' || !Object.hasOwn(ZONE_FEES, zoneRaw)) {
      throw new BadRequestException('ควรเป็น bangkok, north หรือ south เท่านั้น');
    }

    // คำนวณ
    const extraKg = Math.ceil(Math.max(0, weight - 1)); // ส่วนเกิน 1 กก. ปัดขึ้น
    const baseFee = 50 + extraKg * 18;
    const zoneFee = ZONE_FEES[zoneRaw];

    return {
      weight,
      zone: zoneRaw,
      baseFee,
      zoneFee,
      total: baseFee + zoneFee,
    };
  }
}
