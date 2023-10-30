'use client'

import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function TranscriptionForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const [APIKey, setAPIKey] = useState<string>('')

  const { toast } = useToast()

  const formSchema = z.object({
    file: z.any(),
    prompt: z.string(),
    response_format: z.string(),
    APIKey: z.string().min(10),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      prompt: '',
      response_format: 'vtt',
      APIKey: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      console.log(values)
      const formData = new FormData()
      formData.set('file', values.file)
      formData.set('prompt', values.prompt)
      formData.set('response_format', values.response_format)
      formData.set('api_key', values.APIKey)

      const { data } = await axios.post('/api/transcribe', formData)
      console.log(data)
    } catch (error: any) {
      console.log(error)
      toast({
        title: 'Error',
        description: error?.message,
      })
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>
                  Choose your video or audio{' '}
                  <span className="text-xs text-neutral-500">Max: 25MB</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={value?.fileName}
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0]
                      if (selectedFile) {
                        onChange(selectedFile)
                      }
                    }}
                    type="file"
                    max={25 * 1024 * 1024}
                    accept="audio/*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Write a prompt{' '}
                  <span className="text-xs text-neutral-500">
                    You can improve your transcription with a prompt.
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Next.js, Typescript..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="response_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Choose a response type{' '}
                  <span className="text-xs text-neutral-500">You choose SRT or VTT.</span>
                </FormLabel>
                <FormControl>
                  <Select
                    name="response_format"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a response type." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="srt">SRT</SelectItem>
                      <SelectItem value="text">TEXT</SelectItem>
                      <SelectItem value="vtt">VTT</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="APIKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  OpenAI API Key
                  <span className="text-xs text-neutral-500">
                    You key will not be stored anywhere.{' '}
                    <a
                      className="text-neutral-700 dark:text-neutral-200"
                      href="https://platform.openai.com/account/api-keys"
                    >
                      Get your key ↗
                    </a>
                  </span>
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="sk-QT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit">
            {!isLoading ? 'Transcribe' : <span className="animate-pulse">Transcribing...</span>}{' '}
          </Button>
        </div>
      </form>
    </Form>
  )
}
