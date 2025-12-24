import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { Symptom } from './entities/symptom.entity';

@Injectable()
export class SymptomsService {
  constructor(
    @InjectRepository(Symptom)
    private readonly symptomRepository: Repository<Symptom>,
  ) { }

  async create(createSymptomDto: CreateSymptomDto) {
    const symptom = this.symptomRepository.create(createSymptomDto);
    return await this.symptomRepository.save(symptom);
  }

  async findAll() {
    return await this.symptomRepository.find();
  }

  async findOne(id: string) {
    return await this.symptomRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateSymptomDto: UpdateSymptomDto) {
    await this.symptomRepository.update(id, updateSymptomDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const symptom = await this.findOne(id);
    if (symptom) {
      await this.symptomRepository.remove(symptom);
    }
    return symptom;
  }
}
