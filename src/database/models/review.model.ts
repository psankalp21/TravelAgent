import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.connection';
import { User } from './user.model';
import { Booking } from './booking.model';

class Review extends Model {
    public id!: number;
    public user_id!: number;
    public driver_rating!: number;
    public taxi_rating!: number;
    public journey_rating!: number;
    public comment!: string;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Booking,
                key: "id",
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        driver_rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        taxi_rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        journey_rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: sequelize,
        tableName: 'reviews',
        timestamps: true,
    }
);

export { Review };
