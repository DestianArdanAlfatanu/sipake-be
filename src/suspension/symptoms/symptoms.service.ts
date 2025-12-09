import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuspensionSymptom } from './entities/symptoms.entity';
import { Repository } from 'typeorm';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';

@Injectable()
export class SuspensionSymptomsService {
  constructor(
    @InjectRepository(SuspensionSymptom)
    private repo: Repository<SuspensionSymptom>,
  ) {}

  create(dto: CreateSymptomDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateSymptomDto) {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
