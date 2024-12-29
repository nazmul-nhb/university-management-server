import nodemailer from 'nodemailer';
import configs from '../configs';

export const sendEmail = async (to: string, html: string) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com.',
		port: 587,
		secure: configs.NODE_ENV === 'production',
		auth: {
			user: 'nazmulnhb@gmail.com',
			pass: 'xxxx-xxxx-aaaa-aaaa',
		},
	});

	await transporter.sendMail({
		from: 'nazmulnhb@gmail.com', // sender address
		to, // list of receivers
		subject: 'Reset your password within ten mins!', // Subject line
		text: '', // plain text body
		html, // html body
	});
};
