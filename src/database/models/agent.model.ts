import { DataTypes, IntegerDataType, Model, Optional } from 'sequelize'
import { sequelize } from '../db.connection';
import { Booking } from './booking.model';


interface AgentInterface {
    id: IntegerDataType;
    name: string;
    email: string;
    password: string;
    dob:Date;
    phone: string;
    twoFA:string

}


class Agent extends Model<AgentInterface> implements AgentInterface {
    public id!: IntegerDataType;
    public name!: string;
    public email!: string;
    public password!: string;
    public dob!: Date;
    public phone!: string;
    public twoFA!: string;

}


Agent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        twoFA:
        {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: sequelize,
        tableName: 'agents',
        timestamps: false,
    }
);


// Agent.hasOne(Booking, { foreignKey: 'agent_id' });

export {Agent}