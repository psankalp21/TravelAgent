import BaseEntity from "./base.entity";
import { Review } from '../database/models/review.model'
import { Booking } from "../database/models/booking.model";

class ReviewEntity extends BaseEntity {
    constructor() {
        super(Review);
    }

    async addReview(payload) {
        console.log(payload)
        let data = await this.create(payload)
        return data;
    }

    async updateReview(condition, updateData) {
        let data = await this.update(updateData, condition)
        return data
    }

    async ifReviewExists(booking_id) {
        let condition = { id: booking_id }
        let data = await this.findOne(condition)
        return data;
    }
   

    async fetchBookingsReview(booking_id) {
        let condition = { id: booking_id }
        let data = await this.findOne(condition)
        return data
    }

    async fetchDriverReview(bookingids) {
        let condition = {
            attributes: ['id', 'driver_rating', 'comment'],
            where: {
              id: bookingids, 
            },
          }
        let data = await this.findAllwithAttrib(condition)
        return data
    }

    async fetchTaxiReview(taxiids) {
        let condition = {
            attributes: ['id', 'taxi_rating', 'comment'],
            where: {
              id: taxiids, 
            },
          }
        let data = await this.findAllwithAttrib(condition)
        return data
    }
}

export const ReviewE = new ReviewEntity();


