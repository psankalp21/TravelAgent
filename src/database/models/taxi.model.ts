import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.connection';
import { Booking } from './booking.model';
import { Category } from './category.model';

interface TaxiInterface {
    id: string;
    model: string;
    category: string;
    capacity: number;
    fuel_type: string;
    available: boolean;
}

class Taxi extends Model<TaxiInterface> implements TaxiInterface {
    public id!: string;
    public model!: string;
    public category!: string;
    public capacity!: number;
    public fuel_type!: string;
    public available!: boolean;
}

Taxi.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Category,
                key: "categoryName",
              },
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fuel_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        available: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize,
        tableName: 'taxi',
        timestamps: false,
    }
);

Taxi.hasMany(Booking, { foreignKey: 'taxi_id' });

export { Taxi };
