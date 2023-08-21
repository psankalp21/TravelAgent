import { DataTypes, IntegerDataType, Model, Optional } from 'sequelize'
import { sequelize } from '../db.connection';


interface DriverInterface {
    id: IntegerDataType;
    name: string;
    dob:string;
    phone: string;
    available: boolean

}

class Driver extends Model<DriverInterface> implements DriverInterface {
    public id!: IntegerDataType;
    public name!: string;
    public dob!: string;
    public phone!: string;
    public available!: boolean
}


Driver.init(
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
        dob: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        available:{
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    },
    {
        sequelize: sequelize,
        tableName: 'drivers',
        timestamps: false,
    }
);



export {Driver}