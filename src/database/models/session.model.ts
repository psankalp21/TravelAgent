import { DataTypes, DateDataType, Model, Optional } from 'sequelize'
import { sequelize } from '../db.connection';
import { User } from './user.model';

interface SessionAttributes {
  id: string;
  user_id: number;
  ip_addr: string;
  active: string;
  expiry: Date;
}

class Session extends Model<SessionAttributes> implements SessionAttributes {
  public id!: string;
  public user_id!: number;
  public ip_addr!: string;
  public active!: string;
  public expiry!: Date;

}

Session.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ip_addr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize, 
    modelName: 'sessions',
    timestamps: false,
  }
);

export default Session;
