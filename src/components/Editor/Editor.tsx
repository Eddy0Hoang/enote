import * as React from 'react'
import './Editor.css'
import E from 'wangeditor'

export interface IEditorProps {
	onChange?: Function,
	html?: string
}
class Editor extends React.Component<IEditorProps> {
	editorRef: React.RefObject<HTMLDivElement> = React.createRef()
	editor:any = null
	constructor(props: IEditorProps) {
		super(props)
	}

	componentDidMount() {
		const editorEle = this.editorRef.current
		const editor = new E(editorEle)
		editor.customConfig.uploadImgServer = 'http://localhost:9010/upload'
		editor.customConfig.zIndex = 0
		editor.customConfig.onchange = (html: String) => {
			this.props.onChange && this.props.onChange(html)
		}
		editor.create()
		this.editor = editor
	}

	/**
	 * setHtml
	 */
	public setHtml(html:string) {
		this.editor.txt.html(html)
	}
	public render() {
		this.props.html && this.editor && this.editor.txt.html(this.props.html)
		return (
			<div className="editor h-100" ref={this.editorRef} />
		)
	}
}

export default Editor