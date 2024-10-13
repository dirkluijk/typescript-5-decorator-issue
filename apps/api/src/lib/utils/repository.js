import { HTTPException } from "hono/http-exception";
export const takeFirst = (values) => {
    if (values.length === 0)
        return null;
    return values[0];
};
export const takeFirstOrThrow = (values) => {
    if (values.length === 0)
        throw new HTTPException(404, {
            message: 'Resource not found'
        });
    return values[0];
};
