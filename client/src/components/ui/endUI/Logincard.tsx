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
import { useEffect, useState } from "react"


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


  const [demograph, setDemograph] = useState({})

  const [signupinfo, setSignupinfo] = useState({
    role: '',
    fullname: '',
    id: '',
    password: '',
    demograph: {}
  })

  useEffect(()=>{
    setSignupinfo({...signupinfo, demograph: demograph, role:title})
  }, [demograph, title])

  const handlechange = (e:any) => {
    setLogininfo ({
      ...logininfo,
      [e.target.id]: e.target.value
    })
  }

  const [sSigninfo, setsSigninfo] = useState(null)

 useEffect(()=>{

  sSigninfo && fetch('/api/userinfo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(sSigninfo),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});


 }, [sSigninfo])
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">ورود</TabsTrigger>
        <TabsTrigger value="sign">ثبت نام</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>ورود</CardTitle>
            <CardDescription>
                به حساب خود وارد شوید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">

            <div className="space-y-1">
              <Label htmlFor="useridLogin">یوزر ایدی</Label>
              <Input id="useridLogin" placeholder="Enter your user id" onChange={handlechange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">رمز عبور</Label>
              <Input id="password" type="password" placeholder="by default the user id" onChange={handlechange}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={()=> (
              setSub({...logininfo},
              setSeecontent(true)
              ))}>ورود</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="sign">
        <Card>
          <CardHeader>
            <CardTitle>ثبت نام</CardTitle>
            <CardDescription>
              لطفا این فرم را با دقت پر کنید!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          <div className="flex flex-col space-y-1">
              <Label htmlFor="role">نقش</Label>
              <Rdrop roles={roles} title={title} setTitle={setTitle} titleDrop={"نقش های در دسترس"}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="fullname">نام و نام خانوادگی</Label>
              <Input id="fullname" onChange={(e)=> setSignupinfo({...signupinfo, fullname: e.target.value})}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="id">یوزر آیدی</Label>
              <p className=" font-extralight">دقت کنید که همان آیدی وارد شده در اپ موبایل را وارد کنید</p>
              <Input id="id" type="number" maxLength={10} minLength={10} onChange={(e)=> setSignupinfo({...signupinfo, id: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pass">password</Label>
              <Input id="pass" type="password" onChange={(e)=> setSignupinfo({...signupinfo, password: e.target.value})}/>
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="pass">اطلاعات دموگرافیک</Label>
              <Demograph demograph={demograph} setDemograph={setDemograph} vaz={title} />
            </div>
            
          </CardContent>
          <CardFooter>
            <Button
              onClick={()=> {
                setSignupinfo({...signupinfo, role: title})
                setSignupinfo({...signupinfo, demograph: Object(demograph)})
                setsSigninfo(signupinfo)}}
            >Submit</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
