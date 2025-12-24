import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Rule } from '../rules/entities/rule.entity';
import { Symptom } from '../symptoms/entities/symptom.entity';
import { Problem } from '../problems/entities/problem.entity';
import { ConsultationHistory } from './entities/consultation_history.entity';
import { User } from '../../users/entities/user.entity';
import { ConsultationProcessStepDto } from './dto/consultation-process-step.dto';

// Interface untuk session konsultasi
interface ConsultationSession {
    username: string;
    answeredSymptoms: Map<string, boolean>; // symptomId -> yes/no
    askedSymptomIds: Set<string>; // symptom yang sudah ditanyakan
}

@Injectable()
export class ConsultationsStepService {
    // In-memory storage untuk session (untuk production gunakan Redis)
    private sessions: Map<string, ConsultationSession> = new Map();

    constructor(
        @InjectRepository(Symptom)
        private symptomRepository: Repository<Symptom>,
        @InjectRepository(Rule)
        private rulesRepository: Repository<Rule>,
        @InjectRepository(Problem)
        private problemRepository: Repository<Problem>,
        @InjectRepository(ConsultationHistory)
        private historyRepository: Repository<ConsultationHistory>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    /**
     * Start consultation - return first symptom
     */
    async start() {
        // Ambil gejala pertama yang ada di database
        const firstSymptom = await this.symptomRepository.findOne({
            where: {},
            order: { id: 'ASC' },
        });

        if (!firstSymptom) {
            throw new Error('No symptoms found in database');
        }

        return {
            id: firstSymptom.id,
            name: firstSymptom.name,
            picture: firstSymptom.picture,
        };
    }

    /**
     * Process one symptom answer and return next symptom or ranked results
     * CERTAINTY FACTOR METHOD - EXHAUSTIVE SEARCH
     */
    async process(username: string, dto: ConsultationProcessStepDto) {
        // Get or create session
        let session = this.sessions.get(username);
        if (!session) {
            session = {
                username,
                answeredSymptoms: new Map(),
                askedSymptomIds: new Set(),
            };
            this.sessions.set(username, session);
        }

        // Save answer (simpan dulu, jangan langsung proses)
        session.answeredSymptoms.set(dto.symptom_id, dto.yes);
        session.askedSymptomIds.add(dto.symptom_id);

        // Check if there are more symptoms to ask
        const nextSymptom = await this.getNextSymptom(session);

        if (nextSymptom) {
            // CONTINUE ASKING - Belum selesai, masih ada gejala yang belum ditanyakan
            return {
                status: 'Continue',
                data: { symptom: nextSymptom },
            };
        }

        // ALL SYMPTOMS ASKED - Sekarang hitung CF untuk SEMUA masalah
        const yesSymptomIds = Array.from(session.answeredSymptoms.entries())
            .filter(([_, yes]) => yes)
            .map(([id, _]) => id);

        // Jika user tidak menjawab "Ya" sama sekali
        if (yesSymptomIds.length === 0) {
            this.sessions.delete(username);
            return {
                status: 'NeverHadAProblem',
                data: null,
            };
        }

        // Calculate CF untuk SEMUA masalah (bukan hanya yang tertinggi)
        const allResults = await this.calculateAllCF(yesSymptomIds);

        if (allResults.length === 0) {
            this.sessions.delete(username);
            return {
                status: 'ProblemNotFound',
                data: null,
            };
        }

        // Save top result to history (masalah dengan CF tertinggi)
        const topResult = allResults[0];
        await this.saveToHistory(username, topResult);

        // Clear session
        this.sessions.delete(username);

        // Return RANKED LIST of all possible problems
        return {
            status: 'Result',
            data: {
                id: topResult.historyId,
                rankings: allResults.map(r => ({
                    problem: {
                        id: r.problem.id,
                        name: r.problem.name,
                        description: r.problem.description,
                        picture: r.problem.picture,
                        solution: r.problem.solution,
                    },
                    certainty: r.certainty,
                    percentage: `${(r.certainty * 100).toFixed(1)}%`,
                    likelihood: this.getLikelihoodLabel(r.certainty),
                })),
            },
        };
    }

    /**
     * Get next symptom to ask based on current session
     */
    private async getNextSymptom(session: ConsultationSession): Promise<any> {
        // Get all symptoms
        const allSymptoms = await this.symptomRepository.find({
            order: { id: 'ASC' },
        });

        // Find first symptom that hasn't been asked
        const nextSymptom = allSymptoms.find(
            (s) => !session.askedSymptomIds.has(s.id),
        );

        if (!nextSymptom) {
            return null;
        }

        return {
            id: nextSymptom.id,
            name: nextSymptom.name,
            picture: nextSymptom.picture,
        };
    }

    /**
     * Calculate Certainty Factor for ALL problems based on answered symptoms
     * Returns RANKED LIST of all possible problems with their CF scores
     */
    private async calculateAllCF(yesSymptomIds: string[]): Promise<any[]> {
        if (yesSymptomIds.length === 0) {
            return [];
        }

        // Get all rules for symptoms user answered YES
        const rules = await this.rulesRepository.find({
            where: yesSymptomIds.map((id) => ({ symptom: { id } })),
            relations: ['problem', 'symptom', 'problem.solution'],
        });

        if (rules.length === 0) {
            return [];
        }

        // Group rules by problem
        const grouped: Record<string, Rule[]> = {};
        for (const rule of rules) {
            const pid = rule.problem.id;
            if (!grouped[pid]) grouped[pid] = [];
            grouped[pid].push(rule);
        }

        // Calculate CF for each problem using CF COMBINE formula
        const results: any[] = [];
        for (const pid of Object.keys(grouped)) {
            let CFold = 0;
            const rulesForProblem = grouped[pid];
            const problem = rulesForProblem[0].problem;

            for (const rule of rulesForProblem) {
                // User answered YES, so CF_user = 1.0
                const CF_user = 1.0;
                const CF_expert = this.clamp(rule.cfPakar, 0, 1);
                const CF_current = CF_user * CF_expert;

                // CF COMBINE FORMULA: CF_old + CF_current * (1 - CF_old)
                CFold = CFold + CF_current * (1 - CFold);
            }

            results.push({
                problem: problem,
                certainty: CFold,
            });
        }

        // Sort by certainty (highest first) - RANKING
        results.sort((a, b) => b.certainty - a.certainty);

        // Return ALL results, not just the top one
        return results;
    }

    /**
     * Get likelihood label based on certainty percentage
     */
    private getLikelihoodLabel(certainty: number): string {
        const percentage = certainty * 100;

        if (percentage >= 80) return 'Sangat Mungkin';
        if (percentage >= 60) return 'Kemungkinan Besar';
        if (percentage >= 40) return 'Kemungkinan Sedang';
        if (percentage >= 20) return 'Kemungkinan Kecil';
        return 'Sangat Kecil';
    }

    /**
     * Save consultation result to history
     */
    private async saveToHistory(username: string, result: any): Promise<number> {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) {
            return 0;
        }

        const history = this.historyRepository.create({
            user: user,
            problem_id: result.problem.id,
            consultation_date: new Date(),
            status: `Certainty: ${(result.certainty * 100).toFixed(2)}%`,
            module: 'engine',
        });

        const saved = await this.historyRepository.save(history);
        result.historyId = saved.id;
        return saved.id;
    }

    /**
     * Get consultation histories for a user
     */
    async getHistories(username: string) {
        // Get histories for this user and module
        const histories = await this.historyRepository.find({
            where: {
                user: { username },
                module: 'engine',
            },
            order: { consultation_date: 'DESC' },
        });

        // Manually fetch problem and solution data for each history
        const result = await Promise.all(
            histories.map(async (history) => {
                if (!history.problem_id) {
                    return {
                        id: history.id,
                        consultation_date: history.consultation_date,
                        status: history.status,
                        module: history.module,
                        problem: null,
                    };
                }

                // Fetch problem with solution
                const problem = await this.problemRepository.findOne({
                    where: { id: history.problem_id },
                    relations: ['solution'],
                });

                return {
                    id: history.id,
                    consultation_date: history.consultation_date,
                    status: history.status,
                    module: history.module,
                    problem: problem ? {
                        id: problem.id,
                        name: problem.name,
                        description: problem.description,
                        picture: problem.pict,
                        solution: problem.solution ? {
                            id: problem.solution.id,
                            name: problem.solution.solution,
                        } : null,
                    } : null,
                };
            })
        );

        return result;
    }

    /**
     * Helper: clamp value between min and max
     */
    private clamp(v: number, min = 0, max = 1) {
        if (typeof v !== 'number' || Number.isNaN(v)) return min;
        return Math.min(Math.max(v, min), max);
    }
}
