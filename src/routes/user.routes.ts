import { ServerRoute } from "@hapi/hapi"
import { booking_managment_controller, user_category_controller, user_logout_controller, user_taxi_controller } from "../controllers/user.controller"
import { jwtMiddleware } from '../middleware/jwt';
import Joi from "joi";
const userRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/addBooking',
    handler: booking_managment_controller.add_booking,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "Book a taxi for a journey. Use date in following format : 2023-09-04 00:00:00",
      validate: {
        payload: Joi.object({
          source_city: Joi.string().required(),
          source_state: Joi.string().required(),
          destination_city: Joi.string().required(),
          destination_state: Joi.string().required(),
          taxi_id: Joi.string().required(),
          date_time: Joi.string().required(),
 

        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      },
    },
}
,

  {
    method: 'get',
    path: '/checkFare',
    handler: booking_managment_controller.check_fare,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "User can get an estimated fare.",
      validate: {
        query: Joi.object({
          source: Joi.string().required(),
          destination: Joi.string().required(),
          car_category: Joi.string().required()
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      },
    },
  },
  {
    method: 'GET',
    path: '/getAvailableTaxis',
    handler: user_taxi_controller.get_taxi,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "Fetch all available taxis for a booking",
      validate: {
        query: Joi.object({
          capacity: Joi.number(),
          category: Joi.string(),
          fuel_type: Joi.string().required(),
          date_time: Joi.string().required(),
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]

        }
      }
    }
  },
  {
    method: 'GET',
    path: '/viewAllBookings',
    handler: booking_managment_controller.view_all_bookings,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "Fetch all bookings for a user (Upcoming/Completed/Ongoing)",
    }
  },
  {
    method: 'GET',
    path: '/getBookingById',
    handler: booking_managment_controller.view_one_booking,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "Use booking_id to get all details regarding that booking",
      validate: {
        query: Joi.object({
          booking_id: Joi.number().required()
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      }
    }
  },

  {
    method: 'GET',
    path: '/getAllCategories',
    handler: user_category_controller.get_all_categories,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "User can get details of all the categories like cost",
      validate: {
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]

        }
      }
    }
  },
  {
    method: 'PATCH',
    path: '/startJourney',
    handler: booking_managment_controller.start_journey,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "Users have the option to initiate their journey once they are onboard the taxi",
      validate: {
        payload: Joi.object({
          booking_id: Joi.number().required(),
          OTP: Joi.string().required(),
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]

        }
      }
    }
  },
  {
    method: 'PATCH',
    path: '/endJourney',
    handler: booking_managment_controller.end_journey,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "At the conclusion of a trip, users can mark the journey as completed",

      validate: {
        payload: Joi.object({
          booking_id: Joi.number().required()
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }],

        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/cancelBooking',
    handler: booking_managment_controller.cancel_booking,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "Cancel booking if it is not accepted",
      validate: {
        payload: Joi.object({
          booking_id: Joi.number().required()
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }],

        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/userLogout',
    handler: user_logout_controller.user_logout,
    options: {
      pre: [{ method: jwtMiddleware }],
      tags: ['api', 'user'],
      description: "Logout user and remove the session",
      validate: {
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }],

        }
      }
    }
  }
]



export default userRoutes
