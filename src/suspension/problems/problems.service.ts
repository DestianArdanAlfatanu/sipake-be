import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuspensionProblem } from './entities/problems.entity';
import { SuspensionSolution } from '../solutions/entities/solutions.entity';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Injectable()
export class SuspensionProblemsService {
  constructor(
    @InjectRepository(SuspensionProblem)
    private repo: Repository<SuspensionProblem>,
    @InjectRepository(SuspensionSolution)
    private solutionRepo: Repository<SuspensionSolution>,
  ) { }

  async create(createDto: CreateProblemDto) {
    const problem = this.repo.create({
      id: createDto.id,
      name: createDto.name,
      description: createDto.description,
      pict: createDto.pict,
    });

    // Create solution if provided
    if (createDto.solution) {
      const solution = this.solutionRepo.create({
        solution: createDto.solution,
      });
      problem.solution = solution;
    }

    return this.repo.save(problem);
  }

  findAll() {
    return this.repo.find({ relations: ['solution'], order: { id: 'ASC' } });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['solution', 'rules'] });
  }

  async update(id: string, dto: UpdateProblemDto) {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
