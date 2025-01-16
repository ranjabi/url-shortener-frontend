import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { AxiosResponse } from "axios";
import { apiInstance } from "../../libs/axios";

interface CreatedUrl {
  id: number
  originalUrl: string
  shortUrl: string
}

export default function Index() {
  const [createdUrls, setCreatedUrls] = useState<CreatedUrl[]>([])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const form = e.target as HTMLFormElement;
    const originalUrl = (form.elements.namedItem('originalurl') as HTMLInputElement).value;
    
    try {
      const res: AxiosResponse<{ data: CreatedUrl }> = await apiInstance.post('/urls', null, {
        params: {
          path: originalUrl
        }
      })
      const createdUrl: CreatedUrl = {
        id: res.data.data.id,
        originalUrl: res.data.data.originalUrl,
        shortUrl: res.data.data.shortUrl,
      }
      setCreatedUrls((prevItems) => [createdUrl, ...prevItems])
    } catch (error) {
      console.error(error)
    }

    form.reset()
  }

  return (
    <div className="container mx-auto max-w-screen-lg flex flex-col justify-center min-h-screen relative">
      <form onSubmit={handleSubmit} className="-mt-72 flex flex-col absolute w-full">
        <label htmlFor="originalurl" className="text-6xl text-center">Shorten a long URL</label>
        <div className="flex mt-24">
          <Input type="text" id="originalurl" name="originalurl" placeholder="Enter your link here" className="rounded-r-none h-12 md:text-lg" />
          <Button type="submit" className="rounded-l-none h-12 text-md bg-green-600 hover:bg-green-700">Shorten URL</Button>
        </div>
      </form>
      <div className="mt-8 flex flex-col w-[30rem] gap-6 absolute ml-auto mr-auto left-0 right-0 top-[480px]">
        {createdUrls.map(url => {
          return (
            <div key={url.id} className="bg-gray-200 rounded-lg px-4 py-6">
              <div>
                <p>Your Long URL</p>
                <Input value={url.originalUrl} readOnly className="bg-white mt-1 h-10" />
              </div>
              <div className="mt-5">
                <p>Your Short URL</p>
                <div className="flex items-center bg-red-100 mt-1 h-10">
                  <Input value={url.shortUrl} readOnly className="bg-white h-full rounded-r-none" />
                  <Button type="submit" className="rounded-l-none h-full bg-green-600 hover:bg-green-700">Copy</Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}