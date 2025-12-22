import { DataSource } from 'typeorm';
import { CarSeries } from '../../car/car-series/entities/car-series.entity';
import { CarYear } from '../../car/car-years/entities/car-year.entity';
import { EngineCode } from '../../engine/engine-codes/entities/engine-code.entity';

export class CarDataSeeder {
    constructor(private dataSource: DataSource) { }

    async run() {
        console.log('🌱 Seeding Car Data (Series, Years, Engine Codes)...');

        const carSeriesRepo = this.dataSource.getRepository(CarSeries);
        const carYearRepo = this.dataSource.getRepository(CarYear);
        const engineCodeRepo = this.dataSource.getRepository(EngineCode);

        // ---------- CLEAR OLD DATA ----------
        await carSeriesRepo.delete({});
        await carYearRepo.delete({});
        await engineCodeRepo.delete({});

        // ---------- INSERT CAR SERIES ----------
        const series = [
            { series_id: 'E36', name: 'BMW E36 Series' },
            { series_id: 'E46', name: 'BMW E46 Series' },
            { series_id: 'E90', name: 'BMW E90 Series' },
        ];

        for (const s of series) {
            await carSeriesRepo.save(carSeriesRepo.create(s));
        }
        console.log(`✅ Inserted ${series.length} car series`);

        // ---------- INSERT CAR YEARS ----------
        const years = [
            1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
            2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
            2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
            2020, 2021, 2022, 2023, 2024, 2025,
        ];

        for (const year of years) {
            await carYearRepo.save(carYearRepo.create({ year }));
        }
        console.log(`✅ Inserted ${years.length} car years`);

        // ---------- INSERT ENGINE CODES ----------
        const engineCodes = [
            { code: 'M40B16', description: '1.6L 4-cylinder' },
            { code: 'M40B18', description: '1.8L 4-cylinder' },
            { code: 'M43B16', description: '1.6L 4-cylinder' },
            { code: 'M43B18', description: '1.8L 4-cylinder' },
            { code: 'M50B20', description: '2.0L 6-cylinder' },
            { code: 'M50B25', description: '2.5L 6-cylinder' },
            { code: 'M52B20', description: '2.0L 6-cylinder' },
            { code: 'M52B25', description: '2.5L 6-cylinder' },
            { code: 'M52B28', description: '2.8L 6-cylinder' },
            { code: 'S50B30', description: '3.0L 6-cylinder (M3)' },
            { code: 'S50B32', description: '3.2L 6-cylinder (M3)' },
        ];

        for (const engine of engineCodes) {
            await engineCodeRepo.save(engineCodeRepo.create(engine));
        }
        console.log(`✅ Inserted ${engineCodes.length} engine codes`);

        console.log('✅ Car data seeding completed!');
    }
}
