import {
  DataType,
  Table,
  Model,
  AutoIncrement,
  AllowNull,
  PrimaryKey,
  Column,
  Unique,
  ForeignKey,
} from "sequelize-typescript";
import { Users } from "./user.model";

@Table({
  tableName: "files",
  timestamps: true,
})
export class Files extends Model {
  @AutoIncrement
  @AllowNull(false)
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  type!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  path!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  content!: string;

  @Column({
    type: DataType.STRING,
  })
  url!: string | null;

  @ForeignKey(() => Users)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  ownerId!: number;
}
