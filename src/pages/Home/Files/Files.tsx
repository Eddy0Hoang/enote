import { Card, Empty, List, message, Modal, Tooltip, Form, Input, Drawer, Typography, Descriptions, Button, Space, PageHeader } from 'antd'
import { PathLike } from 'fs'
import * as React from 'react'
import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined, } from '@ant-design/icons'
import { v4 } from 'uuid'
import './Files.scss'

const { ipcRenderer } = window.require('electron')
const id = () => v4().toString()

declare interface FileItem {
	absPath: PathLike,
	name: string,
	id: string,
	mark: string
}

export interface IFilesProps {
	match?: any
}
export interface IFilesState {
	files: Array<FileItem>,
	itemName: string,
	showMarkDrawer: boolean,
	tmpFileItem: any | FileItem
}
class Files extends React.Component<IFilesProps> {
	readonly state: IFilesState = {
		files: [],
		itemName: '',
		showMarkDrawer: false,
		tmpFileItem: {}
	}
	/** 存储临时文本 */
	tmpText: string = ''

	constructor(props: IFilesProps) {
		super(props)
	}

	componentDidMount() {
		let self = this
		this.updateFiles()
	}
	static getDerivedStateFromProps(nextProps: IFilesProps, prevState: IFilesState) {
		let { files, name } = ipcRenderer.sendSync('get-note', nextProps.match.params.id)
		let obj = Object.assign(prevState, {
			files,
			itemName: name
		})
		return name === prevState.itemName ? null : obj
	}
	/**
	 * 更新文件列表
	 */
	private updateFiles = () => {
		let { files, name } = ipcRenderer.sendSync('get-note', this.props.match.params.id)
		this.setState({
			files,
			itemName: name
		})
	}
	private setMark = (values: any) => {
		if (ipcRenderer.sendSync('set-mark', this.props.match.params.id, this.state.tmpFileItem.id, this.state.tmpFileItem.mark)) {
			this.setState({ showMarkDrawer: false }, () => this.updateFiles())
		}
	}
	/**
	 * 删除文件
	 * @param id  文件id
	 */
	private deleteFile = (id: string | PathLike) => {
		let res = ipcRenderer.sendSync('delete-file', this.props.match.params.id, id)
		if (res.ok) {
			this.updateFiles()
			message.success(res.msg)
		} else {
			message.error(res.msg)
		}
	}
	/**
	 * 添加文件
	 */
	private addFile = () => {
		let openRes = ipcRenderer.sendSync('select-files')
		if (openRes.canceled) return
		let files = openRes.filePaths
		let res = ipcRenderer.sendSync('add-files', this.props.match.params.id, files)
		if (res.ok) {
			this.updateFiles()
			message.success(res.msg)
		} else {
			message.error(res.msg)
		}
	}
	/**
	 * 调用默认软件打开文件
	 * @param absPath 文件路径
	 */
	private openFile = (absPath: PathLike) => {
		ipcRenderer.sendSync('open-file', absPath) ? message.loading('正在打开文件', 3) : message.error('打开文件失败')
	}

	public render() {
		return (
			<>
				<Card className="h-100" title="关联的文件" extra={[<a className="btn" onClick={this.addFile}><PlusOutlined /></a>]} key={id()}>
					{
						this.state.files.length === 0 ?
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={(
								<span>
									啥也没有，<a className="btn" onClick={this.addFile}>添加文件</a>
								</span>
							)} />
							:
							<List dataSource={this.state.files} renderItem={(v: FileItem) => (
								<List.Item key={id()} actions={[
									<Tooltip title="修改备注">
										<a className="btn" onClick={() => { this.setState({ showMarkDrawer: true, tmpFileItem: v }) }}><EditOutlined /></a>
									</Tooltip>,
									<Tooltip title="删除当前文件" color={'red'}>
										<a className="btn warning" onClick={() => this.deleteFile(v.id)}><DeleteOutlined /></a>
									</Tooltip>,
									<Tooltip title="打开此文件" color="cyan">
										<a className="btn primary" onClick={() => this.openFile(v.absPath)}><ArrowRightOutlined /></a>
									</Tooltip>
								]}>
									<List.Item.Meta title={v.name} description={
										<>
											<div>
												路径：{v.absPath}
											</div>
											{
												v.mark && v.mark.trim()
												&&
												<div>
													备注：{v.mark}
												</div>
											}
										</>
									} />
								</List.Item>
							)} />
					}
				</Card>
				<Drawer
					title="添加备注"
					onClose={() => this.setState({ showMarkDrawer: false })}
					visible={this.state.showMarkDrawer}
					placement="bottom"
					bodyStyle={{ padding: 0, overflow: 'hidden' }}
				>
					<PageHeader
						title={this.state.tmpFileItem.name}
						subTitle={this.state.tmpFileItem.absPath}
						extra={<Button type="primary" icon={<ArrowRightOutlined />} onClick={this.setMark}>提交</Button>}>
						<Form>
							<Form.Item label="备注">
								<Input.TextArea
									rows={4}
									onChange={e => this.setState({ tmpFileItem: Object.assign(this.state.tmpFileItem, { mark: e.target.value }) })}
									value={this.state.tmpFileItem.mark}
									autoSize={{ maxRows: 4 }} />
							</Form.Item>
						</Form>
					</PageHeader>
				</Drawer>
			</>
		)
	}
}

export default Files