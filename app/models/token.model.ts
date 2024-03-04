import {
  DataType,
  Table,
  Model,
  AllowNull,
  Column,
  ForeignKey,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';
import { Users } from './user.model';

@Table({
  tableName: 'tokens',
  timestamps: false,
})
export class Tokens extends Model {
  @AutoIncrement
  @AllowNull(false)
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  refreshToken!: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;
}
