import { useState } from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'
import { MousePointerSquareDashed, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as XLSX from 'xlsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import { BASE_URL } from '@/api/apiUrl'
import { privatePostRequest } from '@/api/apiFunctions'
import { validateData, validateHeaders } from './validation'

const UploadUser = () => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [tableData, setTableData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>('')

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles
    setIsDragOver(false)
    toast({
      title: `${file.file.type} type is not supported.`,
      description: 'Please choose an Excel file instead.',
      variant: 'destructive',
    })
  }

  const onDropAccepted = async (acceptedFiles: File[]) => {
    const [file] = acceptedFiles
    setIsDragOver(false)
    setFileName(file.name)

    const reader = new FileReader()

    reader.onload = (e) => {
      const binaryStr = e.target?.result
      if (binaryStr) {
        const workbook = XLSX.read(binaryStr, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet) // array of objects
        console.log('jsonData', jsonData)

        if (jsonData.length > 0) {
          // Extract headers from first object's keys
          const headers = Object.keys(jsonData[0] as object)

          // Validate headers
          if (!validateHeaders(headers)) {
            return
          }
          if (!validateData(jsonData)) {
            return
          }
          // If valid, set state
          setTableData(jsonData)
          setColumns(headers)
        }
      }
    }

    reader.readAsBinaryString(file)
  }

  const { mutate: mutateUploadQualityProject } = useMutation({
    mutationFn: async (allData: any[]) => {
      const response = await privatePostRequest(
        BASE_URL + '/quality-users/upload-user-excel',
        allData
      )
      return response.data
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response.data.error,
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      console.log('data', data)
      toast({
        title: 'Success',
        description: `User uploaded and assign to project successfully.`,
      })
    },
  })

  return (
    <div className='container mx-auto px-4 py-4'>
      <Card className=''>
        <CardHeader>
          <CardTitle>Upload Users </CardTitle>
        </CardHeader>
        <CardContent>
          <Dropzone
            onDropRejected={onDropRejected}
            onDropAccepted={onDropAccepted}
            accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
            }}
            onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                className={cn(
                  'flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition-colors duration-200 ease-in-out',
                  {
                    'border-blue-500 bg-blue-50': isDragOver,
                  }
                )}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragOver ? (
                  <MousePointerSquareDashed className='mb-2 h-8 w-8 text-blue-500' />
                ) : (
                  <Upload className='mb-2 h-8 w-8 text-gray-400' />
                )}
                <p className='mb-2 text-sm font-medium text-gray-700'>
                  {isDragOver ? 'Drop file here' : 'Drag & drop file here'}
                </p>
                <p className='text-xs text-gray-500'>
                  or <span className='font-medium text-blue-600'>browse</span>{' '}
                  to choose a file
                </p>
                {fileName && (
                  <p className='mt-2 text-sm font-medium text-green-600'>
                    {fileName}
                  </p>
                )}
              </div>
            )}
          </Dropzone>
        </CardContent>
      </Card>

      <div className='mb-4 flex justify-end'>
        {tableData.length > 0 && (
          <button
            className='w-20 rounded-md bg-blue-500 py-2 text-white'
            onClick={() => mutateUploadQualityProject(tableData)}
          >
            Upload
          </button>
        )}
      </div>

      {tableData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Projects Data</CardTitle>
          </CardHeader>
          <CardContent>
            {/* h-[calc(100vh-20rem)] */}
            <ScrollArea className='h-auto w-full rounded-md border'>
              <div className='relative w-max min-w-full'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableHead key={index} className='font-bold'>
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((column, colIndex) => (
                          <TableCell key={colIndex}>{row[column]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UploadUser
