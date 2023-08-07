import type { NextApiRequest, NextApiResponse } from 'next';
import type {SignupRequest} from '@/types/Account';
const { ACCOUNT_SERVICE_ADDR = 'http://localhost:7072' } = process.env;
import { Account } from '@/types/Account'
import request from '@/utils/Request';

const handler = async ({ method, body, query }: NextApiRequest, res: NextApiResponse<any>) => {
  switch (method) {

    case 'POST': {
      const { name, email, password } = body as SignupRequest;
    
      try {

        const account = await request<Account>({
            url: `${ACCOUNT_SERVICE_ADDR}/accounts`,
            method: 'POST',
            body: {name: name, email: email, password: password},
        })
        console.log(account)
        return res.status(200).json(account);
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
