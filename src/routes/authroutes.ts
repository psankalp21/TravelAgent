import { ServerRoute } from "@hapi/hapi"
import Joi from "joi"
import { user_signup_controller, agent_signup_controller, agent_login_controller, user_login_controller, user_forgot_password_controller, user_verify_otp, agent_login_verification, user_login_verification } from '../controllers'

const authroutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/usersignup',
    handler: user_signup_controller,
    options: {
      tags: ['api', 'userauth'],
      description: " New users can easily register within the system by providing required information",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          dob: Joi.date().required(),
          phone: Joi.string().required(),
        }),
        options: {
          allowUnknown: true
        }
      }
    }
  },

  {
    method: 'POST',
    path: '/agentsignup',
    handler: agent_signup_controller,
    options: {
      tags: ['api', 'agentauth'],
      description: "Agents can create their accounts by providing the necessary information, ensuring secure access to the system",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          dob: Joi.date().required(),
          phone: Joi.string().required(),
        }),
        options: {
          allowUnknown: true
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/agentlogin',
    handler: agent_login_controller,
    options: {
      tags: ['api', 'agentauth'],
      description: "Registered administrators can log in securely to the system using their credentials",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          method: Joi.string().required()
        }),
        options: {
          allowUnknown: true
        }
      }
    }
  },

  {
    method: 'POST',
    path: '/agentLoginVerification',
    handler: agent_login_verification,
    options: {
      tags: ['api', 'agentauth'],
      description: "Agent can verify himself by entering the OTP",

      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          OTP: Joi.string().required()
        }),
        options: {
          allowUnknown: true
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/userlogin',
    handler: user_login_controller,
    options: {
      tags: ['api', 'userauth'],
      description: "Registered users can securely log in to the system using their credentials",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
          method:Joi.string().required()
        }),
        options: {
          allowUnknown: true,
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/userLoginVerification',
    handler: user_login_verification,
    options: {
      tags: ['api', 'userauth'],
      description: "User can verify himself by entering the OTP",

      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          OTP: Joi.string().required(),
        }),
        options: {
          allowUnknown: true
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/forgot_password',
    handler: user_forgot_password_controller,
    options: {
      tags: ['api', 'userauth'],
      description: "Incase user has forgotten his password he can request for password reset with his email",
      validate: {
        query: Joi.object({
          email: Joi.string().email().required(),
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
    path: '/verify_otp',
    handler: user_verify_otp,
    options: {
      tags: ['api', 'userauth'],
      description: "User can enter the OTP recieved for verification and then update his password",
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          otp: Joi.number().required(),
          new_password: Joi.string().required(),
        }),
        options: {
          allowUnknown: true
        }
      }
    }
  }

]

export default authroutes