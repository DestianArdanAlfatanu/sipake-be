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

    const entity = this.repo.create({
      problem,
      symptom,
      cfPakar: dto.expertCf ?? 0.8,
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
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
