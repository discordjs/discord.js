import type { NextApiRequest, NextApiResponse } from 'next';
import './_readme';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ _: '' });
}
