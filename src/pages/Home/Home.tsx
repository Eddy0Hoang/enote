import * as React from 'react'
import './Home.scss'
import { Input, Layout, message, Dropdown, Menu, Modal, Form, Divider } from 'antd'
import { Link, Route, Switch } from 'react-router-dom'
import { DeleteOutlined, DeleteTwoTone, DownOutlined, EyeTwoTone, FileTwoTone, ProjectTwoTone, WarningOutlined } from '@ant-design/icons'
import { v4 as id } from 'uuid'
import Text from './Text'
import Tasks from './Tasks'
import Files from './Files'
import ColoredBtn from '../../components/ColoredControlBtn'

const { ipcRenderer } = window.require('electron')
/**
 * 文件名由id-timestamp-base64和后缀组成，需从base64中提取name
 * @param item 文件名
 */
function getName(item: String) {
	let b64 = item.split('-')[2].split('.')[0]
	return Buffer.from(b64, 'base64').toString()
}

export interface IHomeProps {
	history?: any
}
export interface IHomeState {
	noteNames: Array<String>,
	curItem: String,
	showNameInput: boolean
}
class Home extends React.Component<IHomeProps, IHomeState> {
	readonly state: IHomeState = {
		noteNames: [],
		curItem: '',
		showNameInput: false
	}
	tmpInputName = ''

	constructor(props: IHomeProps) {
		super(props)
	}

	componentDidMount() {
		this.setState({ noteNames: ipcRenderer.sendSync('get-notes') })
	}

	/**
	 * createNote
	 */
	private createNote = () => {
		let self = this
		Modal.confirm({
			icon: null,
			content: (
				<Form>
					<Form.Item label="Name:" rules={[{ required: true, message: '不可为空' }]}>
						<Input onChange={e => this.tmpInputName = e.target.value} />
					</Form.Item>
				</Form>
			),
			onOk() {
				let result = ipcRenderer.sendSync('create-note', self.tmpInputName)
				if (result) {
					self.setState({ noteNames: ipcRenderer.sendSync('get-notes') })
					message.success('successful')
				} else {
					message.error('failed')
				}
			}
		})
	}

	private importNote = () => {

	}

	private deleteNote = (name: String) => {
		if (ipcRenderer.sendSync('delete-note', name.split('-')[0])) {
			message.success('删除成功')
			this.setState({ noteNames: ipcRenderer.sendSync('get-notes') })
			this.props.history.push('/home')
			this.setState({ curItem: '' })
		} else {
			message.error('删除失败')
		}
	}

	private handleExit = () => {
		Modal.confirm({
			title: '提示',
			icon: <WarningOutlined color="red"/>,
			content: <h3>确定退出？</h3>,
			onOk() {
				ipcRenderer.sendSync('window-cmd', 'exit')
			}
		})
	}

	public render() {
		const dropdownMenu = (
			<Menu style={{ width: '150px' }}>
				{
					this.state.noteNames.length === 0 ?
						<Menu.Item className="tc p-10 c-title">
							<span>啥也没有</span>
						</Menu.Item>
						:
						this.state.noteNames.map(v => (
							<Menu.SubMenu
								className="c-title"
								title={getName(v)}
								key={id()}
								onTitleClick={() => {this.setState({ curItem: v });this.props.history.push('/home/' + v.split('-')[0] + '/html')}}>
								<Menu.Item>
									<Link to={'/home/' + v.split('-')[0] + '/html'} onClick={() => this.setState({ curItem: v })}>
										<EyeTwoTone className="mr-10" />查看
								</Link>
								</Menu.Item>
								<Menu.Item>
									<Link to={'/home/' + v.split('-')[0] + '/files'} onClick={() => this.setState({ curItem: v })}>
										<FileTwoTone className="mr-10" />文件
								</Link>
								</Menu.Item>
								<Menu.Item>
									<Link to={'/home/' + v.split('-')[0] + '/tasks'} onClick={() => this.setState({ curItem: v })}>
										<ProjectTwoTone className="mr-10" />任务
								</Link>
								</Menu.Item>
								<Menu.Item>
									<a className="link warning" onClick={() => this.deleteNote(v)}>
										<DeleteOutlined className="mr-10" />删除
										</a>
								</Menu.Item>
							</Menu.SubMenu>
						))
				}
				<Menu.Item>
					<div className="flex-3 bg-aqua">
						<a className="link" onClick={this.createNote}>Create</a>
						<span>{' or '}</span>
						<a className="link" onClick={this.importNote}>Import</a>
					</div>
				</Menu.Item>
			</Menu>
		)
		return (
			<div className="flex-col top-border-radius-5">
				<div className="header flex-3 window-drag top-border-radius-5">
					<div className="border-tl-5"></div>
					<div>
						<Dropdown overlay={dropdownMenu} className="window-no-drag no-select">
							<a className="btn p-10 c-title" onClick={e => e.preventDefault()}>
								{
									this.state.noteNames.length === 0 ? '空空如也'
										: this.state.curItem ? getName(this.state.curItem)
											: 'Click To Choose'
								} <DownOutlined />
							</a>
						</Dropdown>
					</div>
					<div className="border-tr-5">
						<div className="controls-wrapper border-tr-5">
							<div className="window-no-drag controls border-tr-5">
								<ColoredBtn color="#05F446" component={(<svg onClick={() => ipcRenderer.send('window-cmd', 'open-dev-tool')} className="icon" aria-hidden>
									<use xlinkHref="#e-menu" />
								</svg>)} />
								<Divider type="vertical"/>
								<ColoredBtn color="#29CE42" component={(<svg onClick={() => ipcRenderer.send('window-cmd', 'maximize')} className="icon" aria-hidden>
									<use xlinkHref="#e-maximize" />
								</svg>)} />
								<ColoredBtn color="#EBDD32" component={(<svg onClick={() => ipcRenderer.send('window-cmd', 'minimize')} className="icon" aria-hidden>
									<use xlinkHref="#e-minimize" />
								</svg>)} />
								<ColoredBtn color="red" component={(<svg onClick={this.handleExit} className="icon" aria-hidden>
									<use xlinkHref="#e-exit" />
								</svg>)} />
							</div>
						</div>
					</div>
				</div>
				<div className="h-100">
					<Switch>
						<Route path="/home/:id/html" component={Text} />
						<Route path="/home/:id/files" component={Files} />
						<Route path="/home/:id/tasks" component={Tasks} />
					</Switch>
				</div>

			</div>
		)
	}
}

export default Home