import { useState } from 'react'
import axios from 'axios'
import { message, Upload, Form, InputNumber, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { download } from './utils'

const { Dragger } = Upload

const SERVER_URL = 'http://localhost:3000'

function App() {
  const [form] = Form.useForm()
  const [filePath, setFilePath] = useState('')
  const [fileName, setFileName] = useState('')

  const DEFAULT_COLOR = 10

  const onCompression = async (values) => {
    if (!filePath) {
      message.warning('File is required! Please upload a gif file.')
      return
    }
    console.log(values);
    console.log(filePath);
    try {
      const res = await axios.get(`${SERVER_URL}/compression`, {
        params: {
          color: values.color || DEFAULT_COLOR,
          path: filePath,
        },
        responseType: 'arraybuffer'
      })
      const blob = new Blob([res.data], { type: 'image/jpeg' })
      const url = URL.createObjectURL(blob)
      download(url, fileName)
      message.success('🎉🎉🎉 Compression Success! 🎉🎉🎉')
    } catch (err) {
      console.log('compression', err);
      message.error('💣💣💣 Compression Failed! 💣💣💣');
    }

  }

  const props = {
    name: 'file',
    accept: 'image/gif',
    action: `${SERVER_URL}/upload`,
    onChange(info) {
      const { status } = info.file
      if (status === 'done') {
        setFilePath(info.file.response);
        setFileName(info.file.name);
        message.success(`${info.file.name} 文件上传成功`)
      } else if (status === 'error') {
        message.success(`${info.file.name} 文件上传失败`)
      }
    }
  }

  return (
    <>
      <div>
        <h3 style={{ textAlign: 'center' }}>Git Compression Tools</h3>
        <Form style={{ width: '500px', margin: '0 auto' }} form={form} onFinish={onCompression} initialValues={{ color: DEFAULT_COLOR }}>
          <Form.Item label='颜色数量' name='color' rules={[{ required: true, message: 'color is required.' }]}>
            <InputNumber style={{ width: '100%' }} min={2} max={256} />
          </Form.Item>
          <Form.Item>
            <Dragger {...props}>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>点击或拖拽文件到该区域上传</p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>压缩</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default App
