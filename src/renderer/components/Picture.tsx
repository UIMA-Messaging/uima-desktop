import '../styles/Picture.css'
import { wordToHexColor } from '../utils/colors'

export default ({ image, name }: { image?: string; name?: string }) => {
	return <div className="profile-picture-container">{image ? <img src={image} /> : <div style={{ background: name ? wordToHexColor(name) : null }}>{name ? name[0].toUpperCase() : null}</div>}</div>
}
