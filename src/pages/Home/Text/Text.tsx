import * as React from 'react'
import './Text.scss'
import { Radio, message, Empty } from 'antd'
import Editor from '../../../components/Editor'
import { EyeOutlined, EditOutlined, } from '@ant-design/icons'
import { ITaskState } from '../Tasks/Tasks'

const { ipcRenderer } = window.require('electron')

export interface ITextProps {
	match?: any
}
export interface ITextState {
	viewMode: boolean,
	html: string,
	editorWrapperHeight: string,
	itemName: String,
	/** 路由参数更新后设置富文本 */
	shouldSetHtml: boolean
}
/** 对header进行定高，以设置Editor的高度铺满 */
const height = 60
class Text extends React.Component<ITextProps> {
	readonly state: ITextState = {
		viewMode: true,
		html: '',
		editorWrapperHeight: '0px',
		itemName: '',
		shouldSetHtml: false
	}
	contentChanged: boolean = false
	editorWrapperRef: React.RefObject<HTMLDivElement> = React.createRef()
	editorRef: React.RefObject<Editor> = React.createRef()
	constructor(props: ITextProps) {
		super(props)
	}

	static getDerivedStateFromProps(nextProps: ITextProps, prevState: ITextState) {
		let { html, name } = ipcRenderer.sendSync('get-note', nextProps.match.params.id)
		let obj = Object.assign({}, prevState, {
			html,
			itemName: name,
			shouldSetHtml: true
		})
		return prevState.itemName === name ? null : obj
	}

	componentDidUpdate() {
		if (this.state.shouldSetHtml) {
			this.editorRef.current?.setHtml(this.state.html)
			this.setState({ shouldSetHtml: false })
		}
	}

	componentDidMount() {
		let self = this
		let { html, name } = ipcRenderer.sendSync('get-note', this.props.match.params.id)
		this.setState({
			html,
			itemName: name
		})
		ipcRenderer.on('save', () => {
			self.save()
		})
		let h = document.body.clientHeight - 34 - 42 - height
		self.setState({ editorWrapperHeight: h + 'px' })
		window.addEventListener('resize', () => {
			let h = document.body.clientHeight - 34 - 42 - height
			self.setState({ editorWrapperHeight: h + 'px' })
		})
	}
	/** 向主线程发送消息保存当前文档 */
	private save = () => {
		if (!this.contentChanged) return
		if (ipcRenderer.sendSync('alter-note', this.props.match.params.id, { html: this.state.html })) {
			message.success('保存成功', 0.3)
			this.contentChanged = false
		} else {
			message.error('保存失败', 0.5)
		}
	}

	public render() {
		return (
			<>
				<div className="h-100">
					<div className="flex-2" style={{ height }}>
						<div>
							<h4 className="p-10">
								{this.state.itemName}
							</h4>
						</div>
						<Radio.Group size="small" defaultValue={this.state.viewMode} onChange={e => this.setState({ viewMode: e.target.value })} value={this.state.viewMode}>
							<Radio.Button value={true}><EyeOutlined /></Radio.Button>
							<Radio.Button value={false}><EditOutlined /></Radio.Button>
						</Radio.Group>
					</div>
					<div ref={this.editorWrapperRef}>
						{
							(this.state.html.trim() === '' && this.state.viewMode) ?
								<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={(
									<span>
										<span>{(this.state.html.trim() === '' && this.state.viewMode)}</span>
										啥也没有，<a className="btn" onClick={() => this.setState({ viewMode: false })}>去写点什么</a>
									</span>
								)} />
								:
								<div className="p-10" dangerouslySetInnerHTML={{ __html: this.state.html }} style={{ display: this.state.viewMode ? 'block' : 'none' }} />


						}
						<div style={{ display: !this.state.viewMode ? 'block' : 'none', height: this.state.editorWrapperHeight }} className="editor-wrapper">
							<Editor onChange={(e: string) => { this.setState({ html: e }); this.contentChanged = true }} ref={this.editorRef} />
						</div>
					</div>
				</div>
			</>
		)
	}
}

export default Text