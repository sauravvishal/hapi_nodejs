import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { userModal } from "../../modals";
import { methods, routes } from "../../routes";

export const userController = (): Array<ServerRoute> => {
    return [
        {
            method: methods.get,
            path: routes.users,
            async handler(request: Request, h: ResponseToolkit) {
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
            },
        },
    ];
};