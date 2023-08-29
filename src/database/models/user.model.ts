import { DataTypes, IntegerDataType, Model, Optional } from 'sequelize'
import { sequelize } from '../db.connection';
import { Booking } from './booking.model';


interface UserInterface {
    id: IntegerDataType;
    name: string;
    email: string;
    password: string;
    dob:Date;
    phone: string;
    address: string
    twoFA:string
}

class User extends Model<UserInterface> implements UserInterface {
    public id!: IntegerDataType;
    public name!: string;
    public email!: string;
    public password!: string;
    public dob!: Date;
    public phone!: string;
    public address!: string;
    public twoFA!: string;

}


User.init(
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
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        twoFA:
        {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: sequelize,
        tableName: 'users',
        timestamps: false,
    }
);



export {User}