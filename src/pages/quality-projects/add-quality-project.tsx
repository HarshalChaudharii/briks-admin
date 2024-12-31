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
import { validateData, validateHeaders } from './utils/utils'
import { useMutation } from '@tanstack/react-query'
import { BASE_URL } from '@/api/apiUrl'
import axios from 'axios'
import { privatePostRequest } from '@/api/apiFunctions'

const AddQualityProject = () => {
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
        const sheetName = workbook.SheetNames[0] // Get the first sheet
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // Convert to 2D array

        if (jsonData.length > 0) {
          const header = jsonData[0] as string[] // First row as column headers
          if (!validateHeaders(header)) {
            setColumns([])
            setTableData([])
            return
          }
          setColumns(header)

          // Normalize rows to match the number of columns
          const normalizedData = jsonData
            .slice(1) // Skip the header row
            .filter((row: any) =>
              row.some(
                (cell: any) =>
                  cell !== null &&
                  cell !== undefined &&
                  cell.toString().trim() !== ''
              )
            ) // Filter out empty rows
            .map((row: any) => {
              // Normalize rows to match the number of headers
              return Array.from(
                { length: header.length },
                (_, i) => row[i] || ''
              )
            })

          // Validate data for required fields
          if (!validateData(normalizedData, header)) {
            setTableData([]) // Clear table data if validation fails
            return
          }
          setTableData(normalizedData) // Set normalized data as table data
        }
      }
      mutateValidateExcelData({ columns, tableData })
    }

    reader.readAsBinaryString(file)
  }

  const { mutate: mutateValidateExcelData } = useMutation({
    mutationFn: async (data: { columns: string[]; tableData: any[] }) => {
      const response = await axios.post(
        BASE_URL + '/user/validate-excel-data',
        data
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
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Quality project uploaded successfully.',
      })
    },
  })

  const { mutate: mutateUploadQualityProject } = useMutation({
    mutationFn: async (data: { columns: string[]; tableData: any[] }) => {
      const response = await privatePostRequest(
        BASE_URL + '/quality-projects/upload-excel',
        data
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
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Quality project uploaded successfully.',
      })
    },
  })

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Upload Quality Project </CardTitle>
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
                  'flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors duration-200 ease-in-out',
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
        {
          // Add a button to upload the file
          tableData.length > 0 && (
            <button
              className='w-20 rounded-md bg-blue-500 py-2 text-white'
              onClick={() => mutateUploadQualityProject({ columns, tableData })}
            >
              Upload
            </button>
          )
        }
      </div>

      {tableData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Projects Data</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[calc(100vh-20rem)] w-full rounded-md border'>
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
                        {row.map((cell: any, cellIndex: number) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
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

export default AddQualityProject
