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
        return res.status(200).json(token);
      }catch(err) {
        console.log(err);
        return res.status(404).json({error: err});
      }   
    }

    default: {
      return res.status(405);
    }
  }
};

export default handler;
