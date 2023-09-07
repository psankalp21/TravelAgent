import { ServerRoute } from "@hapi/hapi"
import { admin_jwtMiddleware } from "../middleware/jwt";
import Joi from "joi";
import { agent_booking_controller, agent_category_controller, agent_logout_controller, agent_review_controler, driver_managment_controller, taxi_management_controller } from "../controllers/agent.controller"
const agentRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/addDriver',
    handler: driver_managment_controller.add_driver,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents have the capability to input and manage driver details, including personal information and contact details.",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          dob: Joi.string().required(),
          phone: Joi.string().required(),
          available: Joi.boolean()
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
    path: '/getDriverDetails',
    handler: driver_managment_controller.fetch_driver,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "An organized list of all registered drivers, complete with relevant details, is easily accessible",
      validate: {
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      },
    },
  },
  {
    method: 'PATCH',
    path: '/toggleDriverStatus',
    handler: driver_managment_controller.toggle_driver_availability,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Toggle the driver's status from available to unavailable or vice versa",
      validate: {
        query: Joi.object({
          driver_id: Joi.number().required()
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      },
    },
  },
  {
    method: 'DELETE',
    path: '/removeDriver',
    handler: driver_managment_controller.remove_driver,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can remove a driver from the database",
      validate: {
        query: Joi.object({
          driver_id: Joi.string().required()
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]

        }
      },
    },
  },
  {
    method: 'PATCH',
    path: '/rejectBooking',
    handler: agent_booking_controller.reject_booking,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can reject a booking",
      validate: {
        query: Joi.object({
          id: Joi.number().required()
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      },
    },
  },
  {
    method: 'POST',
    path: '/addTaxi',
    handler: taxi_management_controller.add_taxi,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Admins can add new taxi details to the system, including vehicle information, capacity, and availability",
      validate: {
        payload: Joi.object({
          id: Joi.string().required(),
          model: Joi.string().required(),
          category: Joi.string().required(),
          capacity: Joi.number().required(),
          fuel_type: Joi.string().required(),
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]

        }
      }
    }
  },
  {
    method: 'POST',
    path: '/removeTaxi',
    handler: taxi_management_controller.remove_taxi,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents have the rights to remove taxi from the system",
      validate: {
        query: Joi.object({
          taxi_id: Joi.string().required()
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
    path: '/getTaxiDetails',
    handler: taxi_management_controller.fetch_taxi,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "A comprehensive list of available taxis, displaying crucial information about each vehicle, is readily available",
      validate: {
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/getAllBookings',
    handler: agent_booking_controller.get_all_bookings,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "An organized list of all bookings, along with their statuses, is available for administrators to monitor and manage.",
      validate: {
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/getPendingBookings',
    handler: agent_booking_controller.get_pending_bookings,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "An organized list of all bookings that are pending is available for agents.",
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
    path: '/acceptBooking',
    handler: agent_booking_controller.accept_booking,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can accept a pending booking. This will assign a driver & confirm the booking",
      validate: {
        payload: Joi.object({
          booking_id: Joi.number().required(),
          driver_id: Joi.number().required()
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
    path: '/toggleTaxiStatus',
    handler: taxi_management_controller.toggle_taxi_status,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can change the availability status of a taxi",
      validate: {
        payload: Joi.object({
          taxi_id: Joi.string().required(),
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/addTaxiCategory',
    handler: agent_category_controller.add_category,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can add new taxi categories",
      validate: {
        payload: Joi.object({
          categoryName: Joi.string().required(),
          categoryRate: Joi.number().required(),
        }),
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/deleteTaxiCategory',
    handler: agent_category_controller.remove_category,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can remove a taxi category",
      validate: {
        query: Joi.object({
          categoryName: Joi.string().required()
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
    path: '/updateTaxiCategory',
    handler: agent_category_controller.update_category_rate,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can update cost of taxi",
      validate: {
        payload: Joi.object({
          categoryName: Joi.string().required(),
          new_categoryRate: Joi.number().required(),
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
    path: '/getCategoryRate',
    handler: agent_category_controller.get_category_rate,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents get cost of a particular category of a taxi",
      validate: {
        query: Joi.object({
          categoryName: Joi.string().required()
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
    path: '/getCategories',
    handler: agent_category_controller.get_all_category,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can get details of all the categories available",
      validate: {
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/agentLogout',
    handler: agent_logout_controller.agent_logout,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can logout",
      validate: {
        options: {
          allowUnknown: true,
          security: [{ apiKey: [] }]
        }
      }
    }
  },
  
  {
    method: 'GET',
    path: '/getBookingReview',
    handler: agent_review_controler.get_booking_review,
    options: {
      pre: [{ method: admin_jwtMiddleware }],
      tags: ['api', 'agent'],
      description: "Agents can get review of a particular booking.",
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
  }
]

export default agentRoutes
