import '../styles/ProfilePicture.css'
import { User } from '../../common/types'
import { useEffect, useState } from 'react'
import ColorHash from 'color-hash'

export default ({ user }: { user: User }) => {
	const [color, setColor] = useState('')

	useEffect(() => {
        const colorHash = new ColorHash();
        const color_ = colorHash.hex(user.displayName);
        setColor(color_)
	}, [])

	function getHexColorFromHash(hash: string) {
		// Take the first 6 characters of the hash
		const hex = hash.slice(0, 6)
		// Convert the hex string to a number
		const num = parseInt(hex, 16)
		// Use bitwise operators to get the red, green, and blue components
		const red = (num >> 16) & 255
		const green = (num >> 8) & 255
		const blue = num & 255
		// Convert the RGB values to a hex color code
		const hexColor = `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`
		return hexColor
	}

	return <div className="profile-picture-container">{user.image ? <img src={user.image} /> : <div style={{ background: color }}>{user.displayName[0].toUpperCase()}</div>}</div>
}
