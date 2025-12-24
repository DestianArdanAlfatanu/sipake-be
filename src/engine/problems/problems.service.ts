import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) { }

  async create(createProblemDto: CreateProblemDto) {
    const problem = this.problemRepository.create(createProblemDto);
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
    await this.problemRepository.update(id, updateProblemDto);
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
