import * as React from 'react'
import './Tasks.scss'
import { Card, List, Tooltip, Input, PageHeader, Drawer, Button, Form, message, Empty } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { v4 as id } from 'uuid'

const { ipcRenderer } = window.require('electron')

interface TaskItem {
	id: string,
	content: string,
	finished: boolean,
	time?: Number
}
/** interface of props */
export interface ITasksProps {
	match?: any
}
/** interface of state */
export interface ITaskState {
	tmpTaskItem: any | TaskItem,
	tasks: Array<TaskItem>,
	showEditorDrawer: boolean,
	tmpText: string,
	itemName: string
}
class Tasks extends React.Component<ITasksProps> {
	readonly state: ITaskState = {
		tmpTaskItem: {},
		tasks: [],
		showEditorDrawer: false,
		tmpText: '',
		itemName: ''
	}
	alterMode = false
	constructor(props: ITasksProps) {
		super(props)
	}

	componentDidMount() {
		this.updateTasks()
	}

	static getDerivedStateFromProps(nextProps: ITasksProps, prevState: ITaskState) {
		let { tasks, name } = ipcRenderer.sendSync('get-note', nextProps.match.params.id)
		let obj = Object.assign(prevState, {
			tasks,
			itemName: name
		})
		return name === prevState.itemName ? null : obj
	}

	private updateTasks = () => {
		let { tasks, name } = ipcRenderer.sendSync('get-note', this.props.match.params.id)
		this.setState({
			tasks,
			itemName: name
		})
	}
	private addTask = () => {
		if (this.state.tmpText.trim() === '') {
			message.error('任务内容不能为空', 1)
			return
		}
		if (ipcRenderer.sendSync('add-task', this.props.match.params.id, this.state.tmpText).ok) {
			this.updateTasks()
			this.setState({ showEditorDrawer: false })
		}
	}
	private deleteTask = (id: string) => {
		console.log('before del')
		if (ipcRenderer.sendSync('delete-task', this.props.match.params.id, id)) {
			console.log('after del')
			this.updateTasks()
			this.setState({ showEditorDrawer: false })
		}
	}
	private alterTask = () => {
		if (ipcRenderer.sendSync('alter-task', this.props.match.params.id, this.state.tmpTaskItem.id, this.state.tmpTaskItem.content)) {
			this.updateTasks()
			this.setState({ showEditorDrawer: false })
		}
	}
	private toggleTaskFinished = (id: string) => {
		if (ipcRenderer.sendSync('finish-task', this.props.match.params.id, id)) {
			this.updateTasks()
		}
	}
	public render() {
		return (
			<>
				<Card title="任务列表" extra={[<Tooltip title="新建任务"><a className="btn" onClick={() => { this.alterMode = false; this.setState({ showEditorDrawer: true, tmpText: '' }) }}><PlusOutlined /></a></Tooltip>]} key={id()}>
					{
						this.state.tasks.length === 0 ?
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={(
								<span>
									啥也没有，<a className="btn" onClick={() => { this.alterMode = false; this.setState({ showEditorDrawer: true, tmpText: '' }) }}>添加任务</a>
								</span>
							)} />
							:
							<List
								dataSource={this.state.tasks}
								renderItem={v => (
									<List.Item
										className={v.finished ? 'finished' : 'unfinished'}
										onClick={() => this.toggleTaskFinished(v.id)}
										actions={[
											<Tooltip title="修改任务">
												<a className="btn" onClick={() => { this.alterMode = true; this.setState({ tmpTaskItem: v, showEditorDrawer: true, tmpText: v.content }) }}><EditOutlined /></a>
											</Tooltip>,
											<Tooltip title="删除任务" color={'red'}>
												<a className="btn warning" onClick={() => this.deleteTask(v.id)}><DeleteOutlined /></a>
											</Tooltip>,
											<div style={{ display: 'inline-block', width: '50px' }}></div>
										]}>
										<List.Item.Meta
											title={v.content}
											description={'创建于：' + new Date(v.time as number).toLocaleString()} />
									</List.Item>
								)} />
					}
				</Card>
				<Drawer
					title={this.alterMode ? '修改任务' : '添加任务'}
					onClose={() => this.setState({ showEditorDrawer: false })}
					visible={this.state.showEditorDrawer}
					placement="bottom"
					bodyStyle={{ overflow: 'hidden' }}
				>
					<Form>
						<Form.Item>
							<div className="flex-2">
								<div>{new Date().toLocaleString()}</div>
								<Button type="primary" size="small" icon={<ArrowRightOutlined />} onClick={this.alterMode ? this.alterTask : this.addTask}>提交</Button>
							</div>
						</Form.Item>
						<Form.Item label="内容">
							<Input.TextArea
								rows={4}
								onChange={e => this.setState({ tmpText: e.target.value })}
								value={this.state.tmpText}
								autoSize={{ maxRows: 4 }} />
						</Form.Item>
					</Form>
				</Drawer>
			</>
		)
	}
}

export default Tasks