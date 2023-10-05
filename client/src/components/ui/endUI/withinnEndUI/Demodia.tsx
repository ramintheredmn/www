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

  export function Demograph({vaz}: {vaz: string}) {

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
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            onClick={() => {}}
            >Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  