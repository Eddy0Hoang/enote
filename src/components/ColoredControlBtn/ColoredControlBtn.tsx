import * as React from 'react'
import './ColoredControlBtn.scss'
import { QuestionOutlined } from '@ant-design/icons'

/** interface of Props */
export interface IColoredControlBtnProps {
	color: string,
	component: React.Component | JSX.Element
}
/** interface of State */
export interface IColoredControlBtnState {
	hovered: boolean
}
class ColoredControlBtn extends React.Component<IColoredControlBtnProps> {
	readonly state: IColoredControlBtnState = {
		hovered: false
	}
	static readonly defaultProps: IColoredControlBtnProps = {
		color: '#fff',
		component: <QuestionOutlined />
	}
	public render() {
		return (
			<span style={{
				display: 'inline-block',
				width: '16px',
				height: '16px',
				backgroundColor: this.state.hovered ? 'transparent' : this.props.color,
				borderRadius: '50%'
			}}
				onMouseEnter={() => this.setState({ hovered: true })}
				onMouseLeave={() => this.setState({ hovered: false })}>
				{
					this.state.hovered && this.props.component
				}
			</span>
		)
	}
}

export default ColoredControlBtn