import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		console.log('Form submitted:', body);

		const { data, error } = await supabase
			.from('contacts')
			.insert([{ name: body.name, email: body.email, message: body.message }]);

		if (error) throw error;

		return new Response(
			JSON.stringify({ message: 'Message sent successfully!' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		console.error('Error saving data:', error);
		return new Response(
			JSON.stringify({ error: 'An error occurred. Please try again later.' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
};
