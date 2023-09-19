import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';

import { methods, routes } from "../../routes";
import { authService, bcryptService, jwtService } from "../../services";
import { userModal } from "../../modals";
import { User } from '../../interfaces';

export const authController = (): Array<ServerRoute> => {
    return [
        // Register
        {
            method: methods.post,
            path: routes.register,
            async handler({ payload }: Request, h: ResponseToolkit) {
                try {
                    if (!payload) return h.response({
                        status: 404,
                        message: "Payload is required.",
                        data: null
                    }).code(404);

                    let { email, password, type, firstName, lastName, dateOfBirth } = payload as Partial<any>;
                    const { error, value } = authService.register({ email, password, type, firstName, lastName, dateOfBirth });

                    if (error) return h.response({
                        status: 403,
                        message: error.details[0].message,
                        data: null
                    }).code(403);

                    const [ifEmailExist] = await userModal.getUserByEmail(email);
                    if (ifEmailExist) return h.response({
                        status: 409,
                        message: "Email already exist.",
                        data: null
                    }).code(409);

                    password = await bcryptService.encryptPassword(password);

                    const user: User = {
                        email: value.email,
                        password: password,
                        type: value.type,
                        firstName: value.firstName,
                        lastName: value.lastName,
                        dateOfBirth: value.dateOfBirth
                    };

                    const isCreated = await userModal.createUser(user);
                    delete user.password;
                    return h.response({
                        status: 201,
                        message: "User created successfully",
                        data: {
                            id: isCreated,
                            ...user
                        }
                    }).code(201);
                } catch (error) {
                    return h.response({ status: 400, message: "Something went wrong.", data: null }).code(400);
                }
            },
            options: {
                auth: false
            }
        },
        // Login
        {
            method: methods.post,
            path: routes.login,
            async handler({ payload }: Request, h: ResponseToolkit) {
                try {
                    if (!payload) return h.response({
                        status: 404,
                        message: "Payload is required.",
                        data: null
                    }).code(404);

                    let { email, password } = payload as Partial<any>;
                    const { error, value } = authService.login({ email, password });

                    if (error) return h.response({
                        status: 403,
                        message: error.details[0].message,
                        data: null
                    }).code(403);

                    const [ifEmailExist] = await userModal.getUserByEmail(email);
                    if (!ifEmailExist) return h.response({
                        status: 404,
                        message: "Email doesn't exist.",
                        data: null
                    }).code(404);

                    const ifPasswordValid = await bcryptService.decryptPassword(password, ifEmailExist.password);
                    if (!ifPasswordValid) return h.response({
                        status: 401,
                        message: "Incorrect Password.",
                        data: null
                    }).code(401);

                    const token = await jwtService.createToken(ifEmailExist.id, ifEmailExist.type)
                    if (!token) return h.response({ status: 400, message: "Something went wrong.", data: null }).code(400);

                    return h.response({
                        status: 200,
                        message: "Login successful",
                        data: { token }
                    }).code(200);
                } catch (error) {
                    return h.response({ status: 400, message: "Something went wrong.", data: null }).code(400);
                }
            },
            options: {
                auth: false
            }
        }
    ];
};