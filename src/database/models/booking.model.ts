import { DataTypes, IntegerDataType, Model, Optional } from 'sequelize'
import { sequelize } from '../db.connection';
import { User } from './user.model';
import { Driver } from './driver.model';
import { Taxi } from './taxi.model';
import { Agent } from './agent.model';

interface BookingInterface {
    id: IntegerDataType;
    user_id: IntegerDataType;
    source: string;
    destination: string;
    distance:string;
    duration: string;
    driver_id: IntegerDataType;
    taxi_id: string;
    agent_id: IntegerDataType;
    journey_date: Date;
    journey_status: 'scheduled' | 'ongoing' | 'completed' | 'canceled'; 
    booking_status: 'pending' | 'accepted' | 'rejected'; 
    // fare_price: IntegerDataType;
}


class Booking extends Model<BookingInterface> implements BookingInterface {
    public id!: IntegerDataType;
    public user_id: IntegerDataType;
    public source: string;
    public destination: string;
    public distance:string;
    public duration: string;
    public driver_id: IntegerDataType;
    public taxi_id: string;
    public agent_id: IntegerDataType;
    public journey_date: Date;
    public journey_status: 'scheduled' | 'ongoing' | 'completed' | 'canceled';
    public booking_status: 'pending' | 'accepted' | 'rejected';
    // public fare_price: DataTypes.IntegerDataType;
}


Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
              },
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        distance: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Driver,
                key: "id",
              },
        },
        taxi_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: Taxi,
                key: "id",
              },
        },
        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Agent,
                key: "id",
              },
        }
        ,
        journey_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
   
        journey_status:
        {
            type: DataTypes.ENUM('scheduled', 'ongoing','completed','canceled'),
            allowNull: true,
            defaultValue: null, 
        },
        booking_status: {
            type: DataTypes.ENUM('pending', 'accepted','rejected'),
            allowNull: false,
            defaultValue: 'pending', 
        }
        // ,
        // fare_price: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     defaultValue: 0, 
        // }
    },
    {
        sequelize: sequelize,
        tableName: 'bookings',
        timestamps: false,
    }
);
// Booking.belongsTo(Taxi, { foreignKey: 'taxi_id' });


export {Booking}