import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from './entities/rule.entity';
import { Problem } from '../problems/entities/problem.entity';
import { Symptom } from '../symptoms/entities/symptom.entity';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Symptom)
    private readonly symptomRepository: Repository<Symptom>,
  ) { }

  async create(createRuleDto: CreateRuleDto) {
    // Fetch problem and symptom entities
    const problem = await this.problemRepository.findOne({
      where: { id: createRuleDto.problem_id },
    });
    if (!problem) {
      throw new NotFoundException('Problem not found');
    }

    const symptom = await this.symptomRepository.findOne({
      where: { id: createRuleDto.symptom_id },
    });
    if (!symptom) {
      throw new NotFoundException('Symptom not found');
    }

    // Create rule with entities
    const rule = this.ruleRepository.create({
      problem,
      symptom,
      cfPakar: createRuleDto.cf_pakar,
    });

    return await this.ruleRepository.save(rule);
  }

  async findAll() {
    return await this.ruleRepository.find({
      relations: ['problem', 'symptom'],
    });
  }

  async findOne(id: number) {
    return await this.ruleRepository.findOne({
      where: { id },
      relations: ['problem', 'symptom'],
    });
  }

  async findByProblem(problemId: string) {
    return await this.ruleRepository.find({
      where: { problem: { id: problemId } },
      relations: ['problem', 'symptom'],
    });
  }

  async findByProblemAndSymptom(problemId: string, symptomId: string) {
    return await this.ruleRepository.findOne({
      where: {
        problem: { id: problemId },
        symptom: { id: symptomId },
      },
      relations: ['problem', 'symptom'],
    });
  }

  async update(id: number, updateRuleDto: UpdateRuleDto) {
    const rule = await this.findOne(id);
    if (!rule) {
      throw new NotFoundException('Rule not found');
    }

    // Update only cf_pakar if provided
    if (updateRuleDto.cf_pakar !== undefined) {
      rule.cfPakar = updateRuleDto.cf_pakar;
    }

    return await this.ruleRepository.save(rule);
  }

  async remove(id: number) {
    const rule = await this.findOne(id);
    if (rule) {
      await this.ruleRepository.remove(rule);
    }
    return rule;
  }
}
