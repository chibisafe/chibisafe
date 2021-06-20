import { Response } from 'express';
import prisma from '../../../../structures/database';
import type { RequestWithUser } from '../../../../middlewares/auth';

export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: Response) => {
	if (!req.body) return res.status(400).json({ message: 'No body provided' });
	const { coinId, amount, fiatId, noCostTransaction, purchasePrice, label, feePrice, purchaseDate }: {
		coinId: number;
		amount: number;
		fiatId: number;
		noCostTransaction: boolean;
		purchasePrice: number;
		label: string;
		feePrice: number;
		purchaseDate: string;
	} = req.body;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!coinId || !amount || noCostTransaction === null || noCostTransaction === undefined) return res.sendStatus(400);

	await prisma.wallet.create({
		data: {
			userId: req.user.id,
			coinId,
			amount,
			fiatId,
			purchasePrice,
			label,
			feePrice,
			paidPrice: amount * purchasePrice,
			purchaseDate
		}
	});

	return res.sendStatus(200);
};
