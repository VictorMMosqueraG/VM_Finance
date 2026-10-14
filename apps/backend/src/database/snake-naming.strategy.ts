import { DefaultNamingStrategy, type NamingStrategyInterface, type Table } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils.js';

export class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  override tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return userSpecifiedName ?? snakeCase(targetName);
  }

  override columnName(
    propertyName: string,
    customName: string | undefined,
    prefixes: string[],
  ): string {
    return snakeCase(prefixes.concat(customName ?? propertyName).join('_'));
  }

  override relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }

  override joinColumnName(relationName: string, referencedColumnName: string): string {
    return snakeCase(`${relationName}_${referencedColumnName}`);
  }

  override joinTableName(first: string, second: string, firstProperty: string): string {
    return snakeCase(`${first}_${firstProperty.replace(/\./g, '_')}_${second}`);
  }

  override joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return snakeCase(`${tableName}_${columnName ?? propertyName}`);
  }

  override primaryKeyName(tableOrName: Table | string): string {
    return `pk_${this.getTableName(tableOrName)}`;
  }

  override uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return `uq_${this.getTableName(tableOrName)}_${columnNames.join('_')}`;
  }

  override relationConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    return `uq_${this.getTableName(tableOrName)}_${columnNames.join('_')}`;
  }

  override foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
    return `fk_${this.getTableName(tableOrName)}_${columnNames.join('_')}`;
  }

  override indexName(tableOrName: Table | string, columnNames: string[]): string {
    return `idx_${this.getTableName(tableOrName)}_${columnNames.join('_')}`;
  }
}
