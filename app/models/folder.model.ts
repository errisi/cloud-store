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
  tableName: "folders",
  timestamps: true,
})
export class Folders extends Model {
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
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  path!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  files!: string[];

  @ForeignKey(() => Users)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  ownerId!: number;
}
