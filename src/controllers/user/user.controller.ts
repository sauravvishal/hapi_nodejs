import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { userModal } from "../../modals";
import { methods, routes } from "../../routes";
import { authService, bcryptService } from '../../services';
import { User } from '../../interfaces';

export const userController = (): Array<ServerRoute> => {
    return [
        // Get all users
        {
            method: methods.get,
            path: routes.users,
            async handler(request: Request, h: ResponseToolkit) {
                try {
                    let { limit, offset } = request.query;
                    limit = +limit;
                    offset = +offset;

                    if ((limit != 0) && !(limit && (offset || offset === 0))) return h.response({
                        status: 403,
                        message: "Validation error in limit or offset.",
                        data: null
                    }).code(403);

                    const data = await userModal.getAllUsers(limit, offset);
                    if (!data.length) return h.response({ status: 404, message: "Data not found.", data: null }).code(404);
                    return { status: 200, message: "Data found.", data };
                } catch (error) {
                    return h.response({ status: 400, message: "Something went wrong.", data: null }).code(400);
                }
            },
            options: {
                auth: false
            }
        },
        // Get user
        {
            method: methods.get,
            path: routes.user,
            async handler(request: Request, h: ResponseToolkit) {
                try {
                    if (!request.auth.credentials) return h.response({ status: 404, message: "User not found.", data: null }).code(404);
                    return { status: 200, message: "Data found.", data: request.auth.credentials };
                } catch (error) {
                    return h.response({ status: 400, message: "Something went wrong.", data: null }).code(400);
                }
            }
        },
        // Update user
        {
            method: methods.put,
            path: routes.user,
            async handler(request: Request, h: ResponseToolkit) {
                try {
                    const { id } = request.auth.credentials;
                    if (!request.payload) return h.response({
                        status: 404,
                        message: "Payload is required.",
                        data: null
                    }).code(404);

                    let { email, password, firstName, lastName, dateOfBirth } = request.payload as Partial<any>;
                    const { error, value } = authService.update({ email, password, firstName, lastName, dateOfBirth });

                    if (error) return h.response({
                        status: 403,
                        message: error.details[0].message,
                        data: null
                    }).code(403);

                    if (!email && !password && !firstName && !lastName && !dateOfBirth) return h.response({
                        status: 403,
                        message: "Atleast one field required from email, password, firstName, lastName, dateOfBirth.",
                        data: null
                    }).code(403);

                    const user: User = {};

                    if (email) {
                        const [ifEmailExist] = await userModal.getUserByEmail(email);
                        if (ifEmailExist) return h.response({
                            status: 409,
                            message: "Can't update, email already exist.",
                            data: null
                        }).code(409);
                        user['email'] = email;
                    }

                    if (password) {
                        password = await bcryptService.encryptPassword(password);
                        user['password'] = password;
                    }

                    if (firstName) user['firstName'] = firstName;
                    if (lastName) user['lastName'] = lastName;
                    if (dateOfBirth) user['dateOfBirth'] = dateOfBirth;

                    const updatedData = await userModal.updateUser(id, user);

                    if (!updatedData) return h.response({
                        status: 400,
                        message: "User not updated.",
                        data: null
                    }).code(400);

                    return h.response({
                        status: 200,
                        message: "User updated successfully",
                        data: null
                    }).code(200);
                } catch (error) {
                    return h.response({ status: 400, message: "Something went wrong.", data: null }).code(400);
                }
            }
        },
        // Delete user
        {
            method: methods.delete,
            path: routes.user,
            async handler(request: Request, h: ResponseToolkit) {
                try {
                    const { id } = request.auth.credentials;

                    const [ifUser] = await userModal.getUserByID(id);

                    if (!ifUser) return h.response({
                        status: 404,
                        message: "User not found.",
                        data: id
                    }).code(404);

                    const deleted = await userModal.deleteUser(id);
                    if (!deleted.affectedRows) return h.response({
                        status: 400,
                        message: "Something went wrong.",
                        data: id
                    }).code(400);

                    return h.response({
                        status: 200,
                        message: "User deleted successfully",
                        data: null
                    }).code(200);
                } catch (error) {
                    return h.response({ status: 400, message: "Something went wrong.", data: null }).code(400);
                }
            }
        }
    ];
};