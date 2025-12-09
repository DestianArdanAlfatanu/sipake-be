import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuspensionProblem } from './entities/problems.entity';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Injectable()
export class SuspensionProblemsService {
  constructor(
    @InjectRepository(SuspensionProblem)
    private repo: Repository<SuspensionProblem>,
  ) {}

  create(createDto: CreateProblemDto) {
    const ent = this.repo.create(createDto);
    return this.repo.save(ent);
  }

  findAll() {
    return this.repo.find({ relations: ['solution', 'rules'] });
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
