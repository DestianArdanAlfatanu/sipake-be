import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem } from './entities/problem.entity';
import { Solution } from '../solutions/entities/solution.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
    @InjectRepository(Solution)
    private readonly solutionRepository: Repository<Solution>,
  ) { }

  async create(createProblemDto: CreateProblemDto) {
    const problem = this.problemRepository.create({
      id: createProblemDto.id,
      name: createProblemDto.name,
      description: createProblemDto.description,
      pict: createProblemDto.pict,
    });

    // Create solution if provided
    if (createProblemDto.solution) {
      const solution = this.solutionRepository.create({
        solution: createProblemDto.solution,
      });
      problem.solution = solution;
    }

    return await this.problemRepository.save(problem);
  }

  async findAll() {
    return await this.problemRepository.find({
      relations: ['solution'],
    });
  }

  async findOne(id: string) {
    return await this.problemRepository.findOne({
      where: { id },
      relations: ['solution'],
    });
  }

  async update(id: string, updateProblemDto: UpdateProblemDto) {
    const { solution, ...problemData } = updateProblemDto;
    await this.problemRepository.update(id, problemData);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const problem = await this.findOne(id);
    if (problem) {
      await this.problemRepository.remove(problem);
    }
    return problem;
  }
}
