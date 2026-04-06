import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuspensionRule } from './entities/rules.entity';
import { Repository } from 'typeorm';
import { CreateRuleDto } from './dto/create-rule.dto';
import { SuspensionProblem } from '../problems/entities/problems.entity';
import { SuspensionSymptom } from '../symptoms/entities/symptoms.entity';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class SuspensionRulesService {
  constructor(
    @InjectRepository(SuspensionRule)
    private repo: Repository<SuspensionRule>,
    @InjectRepository(SuspensionProblem)
    private problemRepo: Repository<SuspensionProblem>,
    @InjectRepository(SuspensionSymptom)
    private symptomRepo: Repository<SuspensionSymptom>,
  ) { }

  async create(dto: CreateRuleDto) {
    const problem = await this.problemRepo.findOne({ where: { id: dto.problemId } });
    if (!problem) throw new NotFoundException('Problem not found');

    const symptom = await this.symptomRepo.findOne({ where: { id: dto.symptomId } });
    if (!symptom) throw new NotFoundException('Symptom not found');

    // Parse expertCf sebagai float, gunakan default 0.8 jika tidak valid
    const cfValue = typeof dto.expertCf === 'number' && !isNaN(dto.expertCf)
      ? dto.expertCf
      : parseFloat(String(dto.expertCf ?? 0.8)) || 0.8;

    const entity = this.repo.create({
      problem,
      symptom,
      cfPakar: cfValue,
    });

    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findByProblem(problemId: string) {
    return this.repo.find({ where: { problem: { id: problemId } }, order: { id: 'ASC' } });
  }

  findByProblemAndSymptom(problemId: string, symptomId: string) {
    return this.repo.findOne({
      where: {
        problem: { id: problemId },
        symptom: { id: symptomId },
      },
    });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateRuleDto) {
    const rule = await this.repo.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Rule not found');
    }

    // Map DTO field to entity field
    if (dto.expertCf !== undefined) {
      rule.cfPakar = dto.expertCf;
    }

    return this.repo.save(rule);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
