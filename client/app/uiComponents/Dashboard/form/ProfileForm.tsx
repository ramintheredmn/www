import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns-jalali"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {useRef} from 'react'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command"
import DatepickerAsl from "@/components/ui/calendar"
import { faIR } from "date-fns-jalali/locale"
import { TagInput } from "./taginput"
import {useState} from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios"

  const bloodGroups = [
    { label: "A+", value: "14" },
    { label: "A-", value: "15" },
    { label: "B+", value: "24" },
    { label: "B-", value: "25" },
    { label: "O+", value: "34" },
    { label: "O-", value: "35" },
    { label: "AB+", value: "124" },
    { label: "AB-", value: "125" },
    { label: "غیره", value: "0" },
  ] as const


// define the form schema
const formSchema = z.object({
    username: z.string().min(2, {
      message: "اسم شما باید حداقل دو حرف داشته باشد",
    }),

    lastname: z.string().min(3, {
        message: "قامیلی شما باید حداقل سه حرف داشده باشد"
    }),
    userid: z.number().min(10, {
      message: "حداقل ۱۰ عدد"
    }),
    dob: z.date({
        required_error: "زمان تولد شما نیاز است ! ",
      }),
    type: z.enum(["male", "female", "none"], {
      required_error: "جنسیت را انتخاب نکردید",
    }),
    bloodGroup: z.string({
        required_error: "لطفا یک گروه خونی انتخاب کنید",
      }),

    weight: z.number({
      required_error: "نمیتواند خالی باشد"
    }),
    height: z.number({
      required_error: 'نمیتواند خالی باشد'
    }),

    medicines: z.string().optional().array().optional()
  })


export default function UserForm() {

    // define the form, it infers type of the schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
 
        defaultValues: {
          username: "",
          dob: new Date()
        },
      })

      const [tags, setTags] = useState<string[]>(["NO drug"]);

      const { setValue } = form;

      function onSubmit(values: z.infer<typeof formSchema>) {
       const dateMan = values.dob.getTime()
    
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log({...values, dob:dateMan})
        axios.post('/api/recuserinfo', values)
          .then(res => console.log(res))
          .catch(err=> console.log(err))
      }



    return(

    <main className="">
    <Card className=" w-full">
      <CardHeader className="font-pinar-bo">فرم مشخصات بیمار</CardHeader>
      <div className="p-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 place-items-center justify-items-center gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pinar-bo">نام</FormLabel>
                  <FormDescription className="font-pinar-li">
                    نام خود را وارد کنید
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="نام" className="font-pinar-li" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pinar-bo">نام خانوادگی</FormLabel>
                  <FormDescription className="font-pinar-li">
                    نام خانوادگی خود را وارد کنید
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="نام خانوادگی"  className="font-pinar-li" type='text' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userid"

              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pinar-bo">یوزر آیدی</FormLabel>
                  <FormDescription className="font-pinar-li">
                    یوزر آیدی خود را وارد کنید
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="یوزر آیدی" type='text'   className="font-pinar-li" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-pinar-bo">تولد</FormLabel>
                  <FormDescription className="font-pinar-li">
                    سالروز تولد خود را وارد کنید
                  </FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "font-pinar-re",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'yyyy MMMM d', { locale: faIR })
                          ) : (
                            <span>روز تولد خود را انتخاب کنید</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatepickerAsl
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField

              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem >
                  <FormLabel className="font-pinar-bo">جنسیت</FormLabel>
                  <FormDescription className="font-pinar-li">
                    جنسیت خود را انتخاب کنید
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex font-pinar-re flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          مرد
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          زن
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">از جنسیت خود مطمئن نیستم</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-pinar-bo">گروه خونی</FormLabel>
                  <FormDescription className="font-pinar-li">گروه خونی خود را انتخاب کنید</FormDescription>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "font-pinar-re justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? bloodGroups.find(
                              (bg) => bg.value === field.value
                            )?.label
                            : "گروه خونی انتخاب کنید"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="جست و جوی..." />
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {bloodGroups.map((bg) => (
                            <CommandItem
                              value={bg.label}
                              key={bg.value}
                              onSelect={() => {
                                form.setValue("bloodGroup", bg.value)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  bg.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {bg.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pinar-bo">وزن</FormLabel>
                  <FormDescription className="font-pinar-li">
                    وزن خود را در واحد کیلوگرم وارد کنید
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="کیلوگرم ... " type='number' {...field}  className="font-pinar-li" onChange={e=> field.onChange(Number(e.target.value))} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pinar-bo">قد</FormLabel>
                  <FormDescription className="font-pinar-li">
                    قد خود را در واحد سانتی متر وارد کنید
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="... سانتی میتر" type='number'  className="font-pinar-li" {...field} onChange={e=> field.onChange(Number(e.target.value))} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-pinar-bo">داروها </FormLabel>

                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="نام دارو ... "
                      tags={tags}
                      className="font-pinar-re"
                      setTags={(newTags) => {
                        setTags(newTags);
                        setValue("medicines", newTags as [string, ...string[]]);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />



            <Button className="mt-5 w-16 col-span-full" type="submit">ثبت</Button>
          </form>

        </Form>


      </div>
      </Card>
    </main>

  )
}