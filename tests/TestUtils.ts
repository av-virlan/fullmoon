/* istanbul ignore file */

import { performance } from "perf_hooks";
import { printTable, Table } from "console-table-printer";

type BenchmarkResult = { title: string, description: string, time: number, avg: number, errors: number };

export class Stopwatch {
    private readonly DEFAULT_PRECISION: number = 3;

    private _start: number;
    private _end: number;
    private _precision: number;

    constructor(precision?: number) {
        this._precision = precision || this.DEFAULT_PRECISION;
    }

    start() {
        this._start = performance.now();
    }

    stop() {
        this._end = performance.now();
    }

    time(): number {
        return parseFloat((this._end - this._start).toFixed(this._precision));
    }

    reset() {
        this._start = this._end = 0;
    }
}

export class Benchmark {
    private _stopwatches = new Map<string, Stopwatch>();
    private _labelRepeats = new Map<string, number>();
    private _labelErrors = new Map<string, number>();
    private _precision: number;
    private readonly DEFAULT_PRECISION: number = 3;

    constructor(maxAverage?: number, precision?: number) {
        this._precision = precision || this.DEFAULT_PRECISION;
    }

    get(label: string): Stopwatch {
        if (this._stopwatches.has(label)) {
            return this._stopwatches.get(label)!;
        }
        let sw = new Stopwatch(this._precision);
        this._stopwatches.set(label, sw);
        return sw;
    }

    async recordAndPrint(label: string, fn: Function, repeats?: number, skipConsole?: boolean): Promise<Array<BenchmarkResult>> {
        await this.record(label, fn, repeats);
        return this.print(skipConsole);
    }

    async record(label: string, fn: Function, repeats?: number) {
        repeats = repeats || 1;
        let sw = this.get(label);
        let actualRepeats = 0;
        let errors = 0;

        for (let i = 0; i < repeats; i++) {
            try {
                sw.start();
                await fn();
                sw.stop();
                ++actualRepeats;
            } catch {
                ++errors;
                sw.stop();
            }
        }

        let totalRepeats = 0;
        if (this._labelRepeats.has(label)) {
            totalRepeats = this._labelRepeats.get(label)!;
        }
        this._labelRepeats.set(label, totalRepeats + actualRepeats);

        if (errors > 0) {
            let totalErrors = 0;
            if (this._labelErrors.has(label)) {
                totalErrors = this._labelErrors.get(label)!;
            }
            this._labelErrors.set(label, totalErrors + errors);
        }
    }

    print(skipConsole?: boolean): Array<BenchmarkResult> {
        const p = new Table({
            columns: [
                { name: 'description', title: 'Description' },
                { name: 'time', title: 'Total time (ms)' },
                { name: 'avg', title: 'Avg (ms)' },
                { name: 'errors', title: 'Times errored' }
            ],
        });

        let collector = new Array<BenchmarkResult>();
        this._stopwatches.forEach((sw, label) => {
            let avg = parseFloat((sw.time() / (this._labelRepeats.get(label) || 1)).toFixed(this._precision))
            collector.push({
                title: '',
                description: label,
                time: sw.time(),
                avg: avg,
                errors: (this._labelErrors.get(label) || 0)
            });
        });

        collector.forEach(mp => p.addRow(mp));

        if (!skipConsole) {
            p.printTable();
        }

        return collector;
    }
}
export class BenchmarkSuite {
    private static _benchmarks = new Map<string, Benchmark>();
    static currentTest: any;
    static test: any;
    static bench: Benchmark;

    static get(title: string, maxAverage?: number, precision?: number): Benchmark {
        if (BenchmarkSuite._benchmarks.has(title)) {
            return BenchmarkSuite._benchmarks.get(title)!;
        }
        var bm = new Benchmark(maxAverage, precision);
        BenchmarkSuite._benchmarks.set(title, bm);
        return bm;
    }

    static async record(repetitions: number = 99) {
        this.bench = BenchmarkSuite.get(this.currentTest.title);
        let fn = this.currentTest.fn.bind(this);
        if (this.currentTest.fn.toString().indexOf("this.bench.record") > -1) {
            for (let i = 0; i < repetitions; i++) {
                await fn();
            }
        } else {
            await this.bench.record("summary: " + this.currentTest.title, fn, repetitions + 1);
        }
    }

    static report() {
        BenchmarkSuite.print(false);
    }

    static print(skipConsole?: boolean): Array<BenchmarkResult> {
        const p = new Table({
            columns: [
                { name: 'title', title: 'Test title', maxLen: 30 },
                { name: 'description', title: 'Description', maxLen: 30 },
                { name: 'time', title: 'Time taken (ms)' },
                { name: 'avg', title: 'Avg (ms)' },
                { name: 'errors', title: 'Times errored' },
            ],
        });

        let collector = new Array<BenchmarkResult>();
        BenchmarkSuite._benchmarks.forEach((bm, title) => {
            let results = bm.print(true);
            let mappedResults = results.map(value => {
                return {
                    title: title,
                    description: value.description,
                    time: value.time,
                    avg: value.avg,
                    errors: value.errors
                }
            });

            if (!skipConsole) {
                mappedResults.forEach(mp => p.addRow(mp));
            }

            collector.push(...mappedResults);
        });

        if (!skipConsole) {
            p.printTable();
        }

        return collector;
    }
}