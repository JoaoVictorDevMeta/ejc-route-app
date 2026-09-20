#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/49bc6b37b8dc3c1486517903f7bab9bdbaf0622495183b3cc3a00e8ce49bbfdd/contract';
import endContract from '../../snapshots/49bc6b37b8dc3c1486517903f7bab9bdbaf0622495183b3cc3a00e8ce49bbfdd/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'carro',
        columns: [
          col('capacidade', 'int4', {
            notNull: true,
            default: lit(3),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('distanciaKm', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('encontroId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('motorista', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tempoMin', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'configuracao',
        columns: [
          col('atualizadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('encontroId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pesoDistancia', 'float8', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('pesoFila', 'float8', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('pesoIndicacao', 'float8', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('pesoPresenca', 'float8', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('raioClusteringKm', 'float8', {
            notNull: true,
            default: lit(1.5),
            codecRef: { codecId: 'pg/float8@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'encontrista',
        columns: [
          col('carroId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('cep', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('distanciaKm', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('encontroId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endereco', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lat', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('lng', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notaIndicacao', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('notaPresenca', 'int4', {
            notNull: true,
            default: lit(5),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('posicaoFila', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('prioridade', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('score', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('INSCRITO'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('telefone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'encontrista_prioridade_check_b73bfb8e',
            "\"prioridade\" IN ('ALTA', 'MEDIA', 'BAIXA')",
          ),
          checkExpression(
            'encontrista_status_check_9c4ebe0e',
            "\"status\" IN ('INSCRITO', 'CONFIRMADO', 'FILA', 'DESISTIU')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'encontro',
        columns: [
          col('ativo', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('criadoEm', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('data', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('localLat', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('localLng', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('localNome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('paroquiaLat', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('paroquiaLng', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('paroquiaNome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('vagasTotais', 'int4', {
            notNull: true,
            default: lit(30),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'profile',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('nome', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('equipe'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'configuracao',
        constraint: 'configuracao_encontroId_key',
        columns: ['encontroId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'profile',
        constraint: 'profile_userId_key',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'carro',
        index: 'carro_encontroId_idx_5986ca36',
        columns: ['encontroId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'encontrista',
        index: 'encontrista_carroId_idx_3d3e8554',
        columns: ['carroId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'encontrista',
        index: 'encontrista_encontroId_idx_5986ca36',
        columns: ['encontroId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'carro',
        foreignKey: {
          name: 'carro_encontroId_fkey',
          columns: ['encontroId'],
          references: { schema: 'public', table: 'encontro', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'configuracao',
        foreignKey: {
          name: 'configuracao_encontroId_fkey',
          columns: ['encontroId'],
          references: { schema: 'public', table: 'encontro', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'encontrista',
        foreignKey: {
          name: 'encontrista_encontroId_fkey',
          columns: ['encontroId'],
          references: { schema: 'public', table: 'encontro', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'encontrista',
        foreignKey: {
          name: 'encontrista_carroId_fkey',
          columns: ['carroId'],
          references: { schema: 'public', table: 'carro', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
