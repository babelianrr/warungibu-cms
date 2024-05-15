import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default function InputTextRich({label, name, value, setValue}) {
  const onChange = (event, editor) => {
    const data = editor.getData()
    // console.log({event, editor, data})
    setValue(data)
  }

  const onBlur = (event, editor) => {
    // console.log('Blur.', editor)
  }

  const onFocus = (event, editor) => {
    // console.log('Focus.', editor)
  }

  return (
    <div className="sm:col-span-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 rounded-md shadow-sm">
        <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: ['heading', '|', 'bold', 'italic'],
            heading: {
              options: [
                {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
              ],
            },
          }}
          data={value}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            // console.log('Editor is ready to use!', editor)
          }}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>
    </div>
  )
}
