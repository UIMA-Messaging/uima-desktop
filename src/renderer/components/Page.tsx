import '../styles/Page.css'
import { ReactNode } from 'react'

export default ({ title, children }: { title: string; children?: ReactNode }) => {
	return (
		<div className="page-container">
			<h1>{title}</h1>
			<div className='page-container-inner'>{children}</div>
		</div>
	)
}
