import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
  import { Input } from "../../input";
  import { Label } from "@/components/ui/label";
  import { Checkbox } from "../../checkbox";
  import { Rdrop } from "./Radiodropdown";
import { useState } from "react";


  export function Demograph({vaz, demograph, setDemograph}: {vaz: string, demograph: any, setDemograph: any}) {

    const [patientform, setPatientform] = useState({
      age: '',
      gender: '',
      weight: '',
      height: '',
      comorbitis: '',
      drugs: '',    
    
    })

    let content;

    if (vaz == 'Admin') {
        content = <div>admin form</div>
    } else if (vaz == 'Doctor') {
        content = <div>Doctor form</div>
    } else if (vaz == 'Patient') {
        content = <div>Patient form</div>
    } else if (!vaz) {
        content = <div>Pls select role</div>
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" >Open dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please complete this form! </AlertDialogTitle>
            <AlertDialogDescription>
                {content}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {vaz == 'Patient'? <section className="flex flex-col space-y-3">
             <div id="age" className="flex flex-row items-center justify-between space-x-56">
              <Label htmlFor="age">Age</Label>
              <Input type="number" id="age" onChange={(e)=> setPatientform({...patientform, age: e.target.value})}/>
             </div>
             <div id="gender" className="flex flex-row items-center justify-between">
              <Label htmlFor="gender">Gender</Label>
              <div className="mt-2 flex flex-row space-x-2 font-mono">
                <Label htmlFor="male">Male</Label>
                <Checkbox onCheckedChange={()=> {
                  
                  setPatientform({...patientform, gender:'male'})
                }
                }></Checkbox>
                <Label htmlFor="female">Female</Label>
                <Checkbox onCheckedChange={()=>setPatientform({...patientform, gender:'male'})}></Checkbox>
                <Label htmlFor="other">Other</Label>
                <Checkbox onCheckedChange={()=>setPatientform({...patientform, gender:'male'})}></Checkbox>
              </div>

             </div>
             <div id="weight" className="flex flex-row items-center justify-between space-x-56">
              <Label htmlFor="weight">Weight</Label>
              <Input type="number" id="weight" onChange={(e)=> setPatientform({...patientform, weight: e.target.value})}/>
             </div>

             <div id="height" className="flex flex-row items-center justify-between space-x-56">
              <Label htmlFor="height">Height</Label>
              <Input type="number" id="height" onChange={(e)=> setPatientform({...patientform, height: e.target.value})}/>
             </div>
             <div id="comorbitis">

              <Label htmlFor="comorbitis">please enter any health problems you have</Label>
              <Input onChange={(e)=> setPatientform({...patientform, comorbitis: e.target.value})}></Input>
             </div>
             <div id="drugs">

              <Label htmlFor="drugs">please enter any drugs you take</Label>
              <Input onChange={(e)=> setPatientform({...patientform, drugs: e.target.value})}></Input>
             </div>
          </section>:
          
          vaz == 'Doctor'? 
          <section className="flex flex-col space-y-3">
          <div id="age" className="flex flex-row items-center justify-between space-x-56">
           <Label htmlFor="age">Age</Label>
           <Input type="number" id="age" />
          </div>
          <div id="gender" className="flex flex-row items-center justify-between">
           <Label htmlFor="gender">Gender</Label>
           <div className="mt-2 flex flex-row space-x-2 font-mono">
             <Label htmlFor="male">Male</Label>
             <Checkbox></Checkbox>
             <Label htmlFor="female">Female</Label>
             <Checkbox></Checkbox>
             <Label htmlFor="other">Other</Label>
             <Checkbox></Checkbox>
           </div>

          </div>
          <div className="flex flex-row items-center justify-between">

            <Label htmlFor="speciality">Please select your speciality</Label>
            <Rdrop titleDrop="available specialities" roles={["Internal medicine", "GP"]} title={"select one ..."} />
          </div>
       </section>
       :
       vaz == 'Admin' && <section className="flex flex-col space-y-3">admin</section>
          
          }
          
            
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            onClick={() => {setDemograph(patientform)}}
            >Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  