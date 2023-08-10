import type { NextApiRequest, NextApiResponse } from 'next';
import type {SignupRequest} from '@/types/Account';
import cookie from "cookie";

const { ACCOUNT_SERVICE_ADDR = 'http://localhost:7072' } = process.env;


import request from '@/utils/Request';

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {

    case 'POST': {
      const { name, email, password } = body as SignupRequest;
    
      try {
        const token = await request<string>({
            url: `${ACCOUNT_SERVICE_ADDR}/token`,
            method: 'POST',
            body: {name: name, email: email, password: password},
        })

        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
          httpOnly: true,
          sameSite: 'strict',
          path: "/",
        }));

        res.setHeader('Set-Cookie', cookie.serialize('token_exists', "true", {
          httpOnly: false,
          path: "/",
        }));

        return res.status(200).json(token);
      }catch(err) {
        // TODO: better error handling
        console.log(err);
        return res.status(401).json({error: "email or password is wrong"});
      }   
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
