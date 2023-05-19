import { getModels } from '@/lib/models/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getModels(req, res)

    default:
      // return 405
      res.status(405).send('Method not allowed')
  }
}
