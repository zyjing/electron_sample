import * as React from 'react'
import * as ReactDom from 'react-dom'
import {FolderPath} from './FolderPath'
import {FileProperty} from './FileProperty'
import {FileList} from './FileList'

ReactDom.render(<FileProperty />, document.getElementById('file_properties'));

ReactDom.render(<FileList />, document.getElementById('file_list'));

ReactDom.render(<FolderPath />, document.getElementById('folder_path'));