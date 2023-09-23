'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR from 'swr';
import Chart from "@/components/endUI/Chart";
import { ComboboxDemo } from "@/components/endUI/UseridCombobox";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Fetch(url: string| null): any {
  const { data, error, isLoading } = useSWR(url? url: null, fetcher);
  return {
    data,
    error,
    isLoading,
  };
}

export default function Home() {
  const [userid, setUserid] = useState("");
  const { data: userData, error, isLoading } = Fetch(userid? `http://127.0.0.1:5000/api/heartrate/${userid}/86400`: null);
  const [maon, setMaon] = useState(false);
  const [windowsize, setWindowsize] = useState(5);
  const { data: userMa, error: errorma, isLoading: isMAloading } = Fetch(maon?`http://127.0.0.1:5000/api/windowsize/${userid}/${windowsize}/86400`: null);
  console.log(userMa)
  let content;
  if (!userid) {
    content = <div><h1>Select user id</h1></div>;
  } else if (isLoading || (maon && isMAloading)) {
    content = <div>Loading...</div>;
  } else if (error || (maon && errorma)) {
    content = <div>Failed</div>;
  } else {
    content = <div className="w-screen"><Chart heartrate={userData?.heartrate} timestamp={userData?.timestamps} ma={userMa?.ma} /></div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <Tabs defaultValue="heartrate" className="flex flex-col items-center w-screen rounded">
        <TabsList>
          <TabsTrigger value="heartrate">Heart Rate Analyze</TabsTrigger>
          <TabsTrigger value="slac">Activity and Sleep</TabsTrigger>
        </TabsList>
        <TabsContent value="heartrate">
          <section className="flex flex-col h-full items-center w-screen">
            <section className="flex flex-row justify-evenly items-baseline">
              <div className="mt-2 p-2">
                <ComboboxDemo userid={userid} setUserid={setUserid} />
              </div>
              <div className="flex flex-row space-x-2 items-baseline">
                <Checkbox onCheckedChange={() => setMaon(!maon)} />
                <input 
                  className="w-10 p-2 rounded-sm bg-black text-white" 
                  type='number' 
                  value={windowsize} 
                  onChange={(e) => setWindowsize(Number(e.target.value))} 
                />
              </div>
            </section>
            {content}
          </section>
        </TabsContent>
        <TabsContent value="slac">Activity and Sleep</TabsContent>
      </Tabs>
    </main>
  );
}
