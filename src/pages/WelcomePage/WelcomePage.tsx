import * as React from 'react'
import './WelcomePage.scss'
export interface IWelcomePageProps {

}
class WelcomePage extends React.Component<IWelcomePageProps> {
	constructor(props:IWelcomePageProps) {
		super(props)
	}
	public render() {
		return (
			<div className="welcome-page">
				<h2>Welcome!!</h2>
			</div>
		)
	}
}

export default WelcomePage