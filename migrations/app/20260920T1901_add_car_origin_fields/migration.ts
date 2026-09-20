#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/49bc6b37b8dc3c1486517903f7bab9bdbaf0622495183b3cc3a00e8ce49bbfdd/contract';
import startContract from '../../snapshots/49bc6b37b8dc3c1486517903f7bab9bdbaf0622495183b3cc3a00e8ce49bbfdd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ada985f4687b16a1401c89e1ff922632731de20f4bc67c9501a0e3a4d100f556/contract';
import endContract from '../../snapshots/ada985f4687b16a1401c89e1ff922632731de20f4bc67c9501a0e3a4d100f556/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'carro',
        column: col('origemCep', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'carro',
        column: col('origemEndereco', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'carro',
        column: col('origemLat', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'carro',
        column: col('origemLng', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
