'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Rdrop } from "./withinnEndUI/Radiodropdown"
import { Demograph } from "./withinnEndUI/Demodia"
import { useState } from "react"

const roles = ['Patient', 'Doctor', 'Admin']



const info = {
  userid: 'admin',
  password: 'admin',
  role: 'admin',
}

export function Tabbedcard({setSub, sub, setSeecontent}: {setSub: any, sub: any, setSeecontent:any}) {

  const [logininfo, setLogininfo] = useState({
    useridLogin: '',
    password: '',
    role: '',
    demograph:{}
  })



  const [title, setTitle] = useState('Choose one ...')

  const handlechange = (e:any) => {
    setLogininfo ({
      ...logininfo,
      [e.target.id]: e.target.value
    })
  }
  console.log(sub)

  return (
    <Tabs defaultValue="login" className="w-1/4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="sign">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
                Login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">

            <div className="space-y-1">
              <Label htmlFor="useridLogin">userid</Label>
              <Input id="useridLogin" placeholder="Enter your user id" onChange={handlechange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">password</Label>
              <Input id="password" type="password" placeholder="by default the user id" onChange={handlechange}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={()=> (
              setSub({...logininfo},
              setSeecontent(true)
              ))}>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="sign">
        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Please fill this forn carefully!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          <div className="flex flex-col space-y-1">
              <Label htmlFor="role">Role</Label>
              <Rdrop roles={roles} title={title} setTitle={setTitle}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">full name</Label>
              <Input id="name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="userid">user id</Label>
              <p className=" font-extralight">Attention! this should match with the user id in the app for a patient</p>
              <Input id="userid" type="number" maxLength={10} minLength={10} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pass">password</Label>
              <Input id="pass" type="password" />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="pass">Demographic info</Label>
              <Demograph vaz={title} />
            </div>
            
          </CardContent>
          <CardFooter>
            <Button>Submit</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
