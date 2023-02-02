import React, { useState } from 'react';
import Input from './Input';

export default function InputFileNoneImage({
  label,
  // file,
  setFile,
  // isLoading,
}) {
  const [filee, setFilee] = useState('')
  const handleChange = (file, size) => {
    // handle upload, get icon_url
    const formData = new FormData()
    formData.append('file', file)

    // onImageChange(imageList)
    // mutateUploadFile(formData)
  }

  return (
    <>
      <input type='file' accept='.xlsx' className={`flex-1 focus:ring-dnr-turqoise focus:border-dnr-turqoise block 
        w-full min-w-0 sm:text-sm border-gray-300 rounded-r-md rounded-md `}
        // autoComplete="off"
        // onChange={(e) => handleChange(e.target.files[0], e.target.files[0].size)}
        onChange={(e) => setFile(e)}
      />
      {/* <Input id="file" label="Nama Flash Sale" type="file" onChange={setFile} /> */}
      <p className="text-sm text-gray-500">type : xlsx</p>
    </>
  )
}
