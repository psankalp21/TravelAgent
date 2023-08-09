import { DataTypes, IntegerDataType, Model, Optional } from 'sequelize'
import { sequelize } from '../db.connection';


interface UserInterface {
    id: IntegerDataType;
    name: string;
    email: string;
    password: string;
    dob:string;
    phone: string;

}

class User extends Model<UserInterface> implements UserInterface {
    public id!: IntegerDataType;
    public name!: string;
    public email!: string;
    public password!: string;
    public dob!: string;
    public phone!: string;

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
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: sequelize,
        tableName: 'users',
        timestamps: false,
    }
);



export {User}