import { JwtPayload, sign, verify } from 'jsonwebtoken';

export const createToken = (payload: string) => {
    const token = sign(
        {
            sub: payload,
        },
        process.env.TOKEN_SECRET_KEY!,
        { expiresIn: '1d' },
    );

    return token;
};

export const verifyToken = (token: string) => {
    try {
        const { sub, exp } = verify(
            token,
            process.env.TOKEN_SECRET_KEY!,
        ) as JwtPayload;

        if (!sub || !exp) {
            return false;
        }

        if (exp < Date.now() / 1000) {
            return false;
        }

        return sub;
    } catch (err) {
        console.log(err);
        return false;
    }
};
