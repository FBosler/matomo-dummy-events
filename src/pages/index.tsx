import { Inter } from 'next/font/google'
import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import Script from 'next/script'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

type FormData = {
  eventName: string
  eventPayload: string
}

declare const window: Window & { _mtm: any }

const CONTAINER_URL =
  'https://cdn.matomo.cloud/clinlife.matomo.cloud/container_kIEjXUNc_dev_ee672b1b1fdd94494976a6ce.js'

export default function Home() {
  const [eventName, setEventName] = useState('Pageview')
  const [eventPayload, setEventPayload] = useState('{"indication":"cough"}')

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    formData: FormData
  ) => {
    event.preventDefault()

    let eventDetails = {event: formData.eventName}
    try {
      eventDetails = {...eventDetails, ...JSON.parse(eventPayload)}
    } catch (error) {
      console.log(error)
    }

    if (!eventDetails.event ) {
      toast.error(
        <div>
          No event name provided. Please add an event name.
        </div>, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        })
        return
    }

    if (window && window._mtm) {
      window._mtm = window._mtm || []
      window._mtm.push(eventDetails)
      setEventName('')
      setEventPayload('')
    }

    toast.success(
      <div>
        <p className='mb-1'> 
        Submitted: {JSON.stringify(eventDetails)}
        </p>
        <p> 
        You can check window._mtm to make sure event was pushed
        </p>
      </div>, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      })
  }

  return (
    <>
      <Script id="matomo-tag-manager" strategy="afterInteractive">
        {`
          var _mtm = window._mtm = window._mtm || [];
          _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src='${CONTAINER_URL}'; s.parentNode.insertBefore(g,s);
      `}
      </Script>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <form
          onSubmit={(event) => handleSubmit(event, { eventName, eventPayload })}
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white-900">
                Input data for synthetic events
              </h2>
              <p className="mt-2 text-sm leading-6 text-white-600">
                This will be used as the name of the event to identify it in Tag
                Manager. The following container is being used:
              </p>
              <p className="mt-2 text-sm leading-6 text-white-600 italic">
                {CONTAINER_URL}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="eventName"
                    className="block text-sm py-4 font-medium leading-6 text-white-900"
                  >
                    EventName
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        name="eventName"
                        id="eventName"
                        autoComplete="eventName"
                        className="block w-full border-0 bg-transparent py-1.5 pl-1 text-white-900 placeholder:text-white-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Pageview"
                        value={eventName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const { value } = e.target
                          setEventName(value)
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-white-900"
                  >
                    Event Params
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 bg-transparent py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-white-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder='{
                        "indication":"cough"
                      }'
                      value={eventPayload}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        const { value } = e.target
                        setEventPayload(value)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
        <ToastContainer />
      </main>
    </>
  )
}
