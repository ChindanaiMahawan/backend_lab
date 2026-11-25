import { BadRequestException, Injectable } from '@nestjs/common';

const SERVICE_FEES: Record<string, number> = {
  residential: 40,
  business: 90,
};

const TIER_LIMIT = 150; // 150 หน่วยแรก
const RATE_TIER1 = 3;   // หน่วยละ 3 บาท
const RATE_TIER2 = 4;   // ส่วนที่เกินหน่วยละ 4 บาท

@Injectable()
export class ElectricityService {
  convert(unitsRaw?: unknown, typeRaw?: unknown) {
    // ตรวจ units: ต้องเป็นจำนวนเต็ม >= 0
    if (typeof unitsRaw === 'undefined' || typeof typeRaw === 'undefined') {
      throw new BadRequestException('กรุณาใส่หน่วยการใช้ไฟฟ้าและประเภท');
    } else if (typeof unitsRaw !== 'string' || unitsRaw.trim() === '') {
      throw new BadRequestException('กรุณาใส่หน่วยการใช้ไฟฟ้า');
    } else if (typeof typeRaw !== 'string' || typeRaw.trim() === '') {
      throw new BadRequestException('กรุณาใส่ประเภท');
    }
    const units = Number(unitsRaw);
    if (!Number.isInteger(units) || units < 0) {
      throw new BadRequestException('หน่วยการใช้ไฟฟ้า (units) ต้องเป็นจำนวนเต็มที่มากกว่าหรือเท่ากับ 0');
    }

    // ตรวจ type
    const type = typeof typeRaw === 'string' ? typeRaw.trim().toLowerCase() : '';
    if (!Object.hasOwn(SERVICE_FEES, type)) {
      throw new BadRequestException('type ต้องเป็น residential หรือ business เท่านั้น');
    }

    // คำนวณแบบขั้นบันได
    const tier1Units = Math.min(units, TIER_LIMIT);
    const tier2Units = Math.max(0, units - TIER_LIMIT);
    const energyFee = tier1Units * RATE_TIER1 + tier2Units * RATE_TIER2;
    const serviceFee = SERVICE_FEES[type];

    return {
      units,
      type,
      energyFee,
      serviceFee,
      total: energyFee + serviceFee,
    };
  }
}