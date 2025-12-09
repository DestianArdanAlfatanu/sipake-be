import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuspensionSolution } from './entities/solutions.entity';
import { Repository } from 'typeorm';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { SuspensionProblem } from '../problems/entities/problems.entity';
import { UpdateSolutionDto } from './dto/update-solution.dto';

@Injectable()
export class SuspensionSolutionsService {
  constructor(
    @InjectRepository(SuspensionSolution)
    private repo: Repository<SuspensionSolution>,
    @InjectRepository(SuspensionProblem)
    private problemRepo: Repository<SuspensionProblem>,
  ) {}

  async create(dto: CreateSolutionDto) {
    const ent = this.repo.create({ solution: dto.solution });
    const saved = await this.repo.save(ent);

    if (dto.problemId) {
      const problem = await this.problemRepo.findOne({ where: { id: dto.problemId } });
      if (!problem) throw new NotFoundException('Problem not found');
      problem.solution = saved;
      await this.problemRepo.save(problem);
    }

    return saved;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateSolutionDto) {
    await this.repo.update(id, { solution: dto.solution } as any);
    if (dto.problemId !== undefined) {
      const problem = await this.problemRepo.findOne({ where: { id: dto.problemId } });
      if (!problem) throw new NotFoundException('Problem not found');
      problem.solution = await this.repo.findOne({ where: { id } });
      await this.problemRepo.save(problem);
    }
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
