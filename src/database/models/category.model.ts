import { DataTypes, IntegerDataType, Model, Optional } from 'sequelize'
import { sequelize } from '../db.connection';
import { Booking } from './booking.model';


interface CategoryInterface {
    categoryName: string;
    categoryAverage: number;
}


class Category extends Model<CategoryInterface> implements CategoryInterface {
   
    public categoryName!: string;
    public categoryAverage!: number;
}


Category.init(
    {
        categoryName: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        categoryAverage: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: sequelize,
        tableName: 'category',
        timestamps: false,
    }
);


// Agent.hasOne(Booking, { foreignKey: 'agent_id' });

export {Category}