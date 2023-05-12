import axios from 'axios'

export default async function imageToUrl(image: any): Promise<string> {
	const body = new FormData()
	body.set('key', process.env.IMGBB_API_KEY)
	body.append('image', image)
	const res = await axios.post(process.env.IMGBB_BASE_URL, body)
	return res.data.data.display_url
}
