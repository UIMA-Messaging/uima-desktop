import '../styles/ProfilePicture.css'
import { useEffect, useState } from 'react'
import ColorHash from 'color-hash'

export default ({ image, name }: { image?: string; name?: string }) => {
	const [color, setColor] = useState(null)

	useEffect(() => {
		if (!image && name) {
			const colorHash = new ColorHash()
			const color_ = colorHash.hex(name)
			setColor(color_)
		}
	}, [image, name])

	return <div className="profile-picture-container">{image ? <img src={image} /> : <div style={{ background: color }}>{name ? name[0].toUpperCase() : null}</div>}</div>
}
